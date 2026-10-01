# techtalks-discoverlebanon

## Password reset API

Configure `DATABASE_URL`, `FRONTEND_URL`, `SMTP_HOST`, and `MAIL_FROM` for reset-link delivery. SMTP defaults to port `587` with TLS; optionally set `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, and `SMTP_USE_TLS`.

`POST /api/auth/forgot-password` accepts `{"email":"user@example.com"}`. It emails a one-hour reset link when an active account exists and always returns the same success response for known and unknown addresses.

`POST /api/auth/reset-password` accepts `{"token":"<link-token>","password":"<new-password>"}`. Passwords must be at least eight characters. Tokens are single-use, expire after one hour, and are stored hashed.

Run the backend tests from the repository root with:

```powershell
$env:PYTHONPATH = (Resolve-Path backend).Path
python -m unittest discover -s backend\tests -p test_password_reset.py -v
```