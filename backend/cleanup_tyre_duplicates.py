"""
Second Tyre duplicate cleanup for Discover Lebanon.

Usage from backend/:
    python cleanup_tyre_duplicates.py           # READ-ONLY PREVIEW
    python cleanup_tyre_duplicates.py --apply   # ARCHIVE + MERGE + DELETE

Only 7 reviewed duplicate pairs are in scope. Sol Coffee Shop and
Aljawad Dining Tyre are left untouched pending further verification.
"""

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import MetaData, Table, delete, func, inspect, select

from app import app
from extensions import db
from models.place import Place


# name, keep_id, duplicate_id, keep_city, duplicate_city
PAIRS = [
    ("Baroud Restaurant", 1365, 1416, "Tyre - Old Souk", "Old Souk"),
    ("Tyre Coast Nature Reserve", 1396, 1469, "Tyre - South Coast", "Southern Tyre Coast"),
    ("YAM Seafood Resto", 1358, 1423, "Tyre - Western Sea", "Cheikh Abbas Nasser"),
    ("Kahwet al Balad", 1367, 1447, "Tyre - Corniche", "Al Kharab Street"),
    ("Bamboo Restaurant", 1376, 1428, "Borj Ech Chemali / Tyre Area", "Borj Ech Chemali"),
    ("Tyre Hippodrome", 1393, 1449, "Tyre - Al-Bass", "Al-Bass"),
    ("Fiora Patisserie Artisanale", 1382, 1435, "Jal El-Bahr", "Jal El Bahr"),
]

BACKUP = Path("tyre_before_second_cleanup.backup")
ARCHIVE = Path("tyre_second_cleanup_archive.json")


def phone_digits(value):
    return "".join(char for char in (value or "") if char.isdigit())


def snapshot(place):
    return {
        "place_id": place.place_id,
        "columns": {
            col.key: getattr(place, col.key)
            for col in Place.__table__.columns
        },
        "categories": sorted(category.name for category in place.categories),
    }


def main():
    parser = argparse.ArgumentParser(description="Safely merge 7 reviewed Tyre duplicates")
    parser.add_argument("--apply", action="store_true", help="Archive and apply deletion")
    args = parser.parse_args()

    if not BACKUP.is_file() or BACKUP.stat().st_size == 0:
        raise SystemExit(f"STOP: Missing or empty backup: {BACKUP}")

    with app.app_context():
        try:
            total_before = Place.query.count()
            tyre_before = Place.query.filter(Place.region == "Tyre").count()
            print(f"Before: {total_before} total places; {tyre_before} in Tyre")

            kept = {}
            removed = {}
            to_archive = []
            missing = []

            for name, keep_id, duplicate_id, keep_city, duplicate_city in PAIRS:
                keep = db.session.get(Place, keep_id)
                duplicate = db.session.get(Place, duplicate_id)

                if keep is None or duplicate is None:
                    missing.append((name, bool(keep), bool(duplicate)))
                    continue

                assert (
    keep.name.strip().casefold() == name.strip().casefold()
    and duplicate.name.strip().casefold() == name.strip().casefold()
), (
    name,
    repr(keep.name),
    repr(duplicate.name),
    "name mismatch"
)
                assert keep.region == duplicate.region == "Tyre", (name, "region mismatch")
                assert keep.city == keep_city and duplicate.city == duplicate_city, (name, "city mismatch")

                if name not in {"Tyre Coast Nature Reserve", "Tyre Hippodrome"}:
                    assert phone_digits(keep.phone), (name, "phone unavailable")
                    assert phone_digits(keep.phone) == phone_digits(duplicate.phone), (
                        name, "different phone numbers"
                    )
                else:
                    assert {c.name for c in keep.categories} == {
                        c.name for c in duplicate.categories
                    }, (name, "attraction categories differ")

                kept[keep_id] = keep
                removed[duplicate_id] = duplicate
                to_archive.append({
                    "name": name,
                    "keep": snapshot(keep),
                    "duplicate": snapshot(duplicate),
                })

                all_categories = sorted({c.name for c in keep.categories + duplicate.categories})
                print(
                    f"READY: {name} | keep {keep_id}, remove {duplicate_id} "
                    f"| resulting categories: {', '.join(all_categories)}"
                )

            if missing:
                if len(missing) == len(PAIRS) and all(k and not d for _, k, d in missing):
                    print("All 7 duplicate IDs are already gone; nothing to do.")
                    return
                raise RuntimeError(f"STOP: Some expected records are missing: {missing}")

            inspector = inspect(db.engine)
            duplicate_ids = list(removed)
            for table_name in inspector.get_table_names():
                for fk in inspector.get_foreign_keys(table_name):
                    if fk.get("referred_table") != "places":
                        continue
                    columns = fk.get("constrained_columns", [])
                    if len(columns) != 1:
                        raise RuntimeError(f"Composite FK to places needs review: {table_name}")
                    if table_name == "place_categories":
                        continue
                    table = Table(table_name, MetaData(), autoload_with=db.engine)
                    count = db.session.execute(
                        select(func.count()).select_from(table).where(
                            table.c[columns[0]].in_(duplicate_ids)
                        )
                    ).scalar_one()
                    if count:
                        raise RuntimeError(
                            f"STOP: {count} references to duplicate IDs in {table_name}"
                        )

            association = Table("place_categories", MetaData(), autoload_with=db.engine)
            place_fks = [
                fk["constrained_columns"][0]
                for fk in inspector.get_foreign_keys("place_categories")
                if fk.get("referred_table") == "places"
                and len(fk.get("constrained_columns", [])) == 1
            ]
            assert len(place_fks) == 1, "Cannot identify place_categories place FK"

            if not args.apply:
                print("\nDRY RUN SUCCESSFUL. No database changes.")
                print("To apply after reviewing this output: python cleanup_tyre_duplicates.py --apply")
                return

            if ARCHIVE.exists():
                raise RuntimeError(f"STOP: Archive already exists; review it: {ARCHIVE}")

            archive_content = {
                "created_at_utc": datetime.now(timezone.utc).isoformat(),
                "before": {"total_places": total_before, "tyre_places": tyre_before},
                "pairs": to_archive,
            }
            ARCHIVE.write_text(
                json.dumps(archive_content, indent=2, ensure_ascii=False, default=str),
                encoding="utf-8",
            )
            if ARCHIVE.stat().st_size < 100:
                raise RuntimeError("Archive too small; aborting")
            print(f"\nArchived original records to: {ARCHIVE}")

            # Add any categories the retained record is missing, BEFORE deleting duplicates.
            for name, keep_id, duplicate_id, _, _ in PAIRS:
                keep = kept[keep_id]
                duplicate = removed[duplicate_id]
                for category in list(duplicate.categories):
                    if category not in keep.categories:
                        keep.categories.append(category)
            db.session.flush()

            # Explicit association cleanup avoids relying on ORM cascade behavior.
            db.session.execute(
                delete(association).where(association.c[place_fks[0]].in_(duplicate_ids))
            )
            deletion = db.session.execute(
                delete(Place.__table__).where(Place.__table__.c.place_id.in_(duplicate_ids))
            )
            assert deletion.rowcount == 7, f"Expected to remove 7, got {deletion.rowcount}"

            total_after = Place.query.count()
            tyre_after = Place.query.filter(Place.region == "Tyre").count()
            assert total_after == total_before - 7
            assert tyre_after == tyre_before - 7

            # Check the cross-category result BEFORE committing.
            kahwet = kept[1367]
            assert {"Restaurant", "Coffee Shop"}.issubset(
                {category.name for category in kahwet.categories}
            ), "Kahwet al Balad must retain both Restaurant and Coffee Shop"

            db.session.commit()
            print("\nCLEANUP SUCCESSFUL")
            print("Removed: 7 duplicate place records")
            print(f"Total places: {total_after}")
            print(f"Tyre places: {tyre_after}")
            print("Sol Coffee Shop and Aljawad Dining Tyre: UNCHANGED")
        except Exception:
            db.session.rollback()
            print("STOPPED. Uncommitted database modifications rolled back.")
            raise


if __name__ == "__main__":
    main()
