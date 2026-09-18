'use client';

import { useState } from 'react';

const categories = [
  ['All Itineraries', '⊞'],
  ['Cultural Heritage', '♜'],
  ['Nature & Outdoors', '♠'],
  ['Coastal Escapes', '≋'],
  ['Food & Gastronomy', '♜'],
  ['Family Friendly', '♧'],
];

const itineraries = [
  ['Echoes of Empires', 'Baalbek – Anjar – Ksara', 'Cultural Heritage', 'Historical Sites', 'Moderate', '1 Day', 'Explore Lebanon’s Roman legacy, from monumental temples to the vineyards of the Bekaa Valley.', 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=900&q=85'],
  ['Coastal Heritage', 'Byblos – Batroun – Chekka', 'Coastal Escapes', 'Culture & Sea', 'Easy', '1 Day', 'Follow the northern coast through ancient ports, lively souks and clear Mediterranean water.', 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=85'],
  ['Into the Cedars', 'Bsharri – Cedars – Qadisha Valley', 'Nature & Outdoors', 'Nature & Hiking', 'Moderate', '2 Days', 'Walk among Lebanon’s ancient cedars and descend into the dramatic Qadisha Valley.', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85'],
  ['Village Life', 'Beit Mery – Deir el Qamar – Barouk', 'Family Friendly', 'Traditions & People', 'Easy', '1 Day', 'Meet the villages, kitchens and welcoming traditions that shape Lebanon’s mountain life.', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=85'],
  ['Lebanon by the Sea', 'Beirut – Raouché – Jounieh', 'Coastal Escapes', 'Coastal Experience', 'Easy', '1 Day', 'A relaxed coastal day from Beirut’s shore to the blue horizons of Jounieh.', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85'],
  ['Faith & Heritage', 'Harissa – Bkerke – Ehden', 'Cultural Heritage', 'Religious & Cultural', 'Moderate', '2 Days', 'Discover sacred landmarks, mountain monasteries and stories of faith across Lebanon.', 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85'],
  ['Hidden Villages', 'Jezzine – Niha – Barouk', 'Nature & Outdoors', 'Nature & Tradition', 'Moderate', '1 Day', 'Take the quieter road through waterfalls, pine forests and stone villages in the south.', 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85'],
  ['A Taste of Lebanon', 'Bekaa Valley – Wineries – Local Cuisine', 'Food & Gastronomy', 'Food & Wine', 'Easy', '1 Day', 'Taste the Bekaa through family-run wineries, generous tables and local recipes.', 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85'],
];

function MetaIcon({ children }) {
  return <span className="mr-1 text-[0.75rem] text-[#74776e]">{children}</span>;
}

export default function ItinerariesPage() {
  const [activeCategory, setActiveCategory] = useState('All Itineraries');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const visibleItineraries = itineraries.filter((item) => {
    const matchesCategory = activeCategory === 'All Itineraries' || item[2] === activeCategory;
    const searchableText = item.slice(0, 5).join(' ').toLowerCase();
    return matchesCategory && searchableText.includes(searchTerm.toLowerCase());
  });
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <main className="min-h-screen bg-[#f1eee9] text-[#272725]">
      <div className="mx-auto max-w-[1440px] px-4 pb-5 sm:px-6 lg:px-8">
        <header className="flex min-h-[68px] max-w-full items-center justify-end overflow-hidden border-b border-[#d8d3cb] bg-[#f7f5f2] px-1">
          <nav className="flex items-center gap-5 text-[0.63rem] font-medium uppercase tracking-[0.08em] text-[#282826] sm:gap-9 sm:text-[0.68rem]">
            <button type="button" onClick={() => { setActiveCategory('All Itineraries'); scrollTo('itinerary-grid'); }} className="hidden sm:block">Explore the Map</button>
            <button type="button" onClick={() => scrollTo('page-top')} className="border-b border-[#a88c60] pb-2 pt-2">Curated Itineraries</button>
            <button type="button" onClick={() => scrollTo('heritage-stories')} className="hidden sm:block">Heritage Stories</button>
            <span className="hidden h-5 w-px bg-[#c6c0b7] sm:block" />
            <button type="button" onClick={() => setIsSearchOpen((open) => !open)} className="flex items-center gap-2"><span className="text-[1.05rem] leading-none">⌕</span><span className="hidden sm:inline">Search</span></button>
            <div className="relative">
              <button type="button" onClick={() => setIsLanguageOpen((open) => !open)} className="flex items-center gap-2">{language} <span className="text-[0.8rem]">⌄</span></button>
              {isLanguageOpen && <div className="absolute right-0 top-7 z-30 min-w-16 rounded border border-[#d8d3cb] bg-[#fffdfa] p-1 text-center shadow-lg"><button type="button" onClick={() => { setLanguage(language === 'EN' ? 'AR' : 'EN'); setIsLanguageOpen(false); }} className="w-full px-2 py-1 text-[0.62rem]">{language === 'EN' ? 'AR' : 'EN'}</button></div>}
            </div>
          </nav>
        </header>

        <section id="page-top" className="relative isolate h-[290px] overflow-hidden sm:h-[315px]">
          <img src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1800&q=85" alt="Lebanese mountains and coast at sunset" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[rgba(21,35,43,0.32)]" />
          <div className="relative flex h-full items-center justify-between px-7 pb-2 sm:px-12 lg:px-14">
            <div className="max-w-[620px] text-white">
              <p className="mb-3 text-[0.58rem] font-medium uppercase tracking-[0.45em] text-[#eee7dc] sm:text-[0.65rem]">Journeys with meaning</p>
              <h1 className="brand-display text-[3.25rem] leading-[0.92] sm:text-[4.4rem]">Curated Itineraries</h1>
              <p className="mt-4 max-w-[530px] text-[0.82rem] leading-[1.5] text-[#f6f2eb] sm:text-[0.98rem]">
                Handpicked journeys to help you discover the real Lebanon —<br className="hidden sm:block" /> its history, nature, culture and people.
              </p>
            </div>
            <div className="hidden pb-3 pr-2 text-right text-[#f3ece2] sm:block">
              <p className="script-text text-[2.15rem] leading-[0.92]">Same places,</p>
              <p className="script-text text-[2.15rem] leading-[0.92]">different stories.</p>
              <div className="ml-auto mt-4 h-px w-14 bg-[#c5a774]" />
            </div>
          </div>
        </section>

        {isSearchOpen && <div className="border-b border-[#d8d3cb] bg-[#f8f5f1] px-2 py-2"><label htmlFor="itinerary-search" className="sr-only">Search itineraries</label><input id="itinerary-search" autoFocus value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search itineraries, places or themes" className="w-full rounded border border-[#cfc8be] bg-white px-3 py-2 text-sm outline-none focus:border-[#8e896f]" /></div>}

        <div className="flex gap-2 overflow-x-auto py-3 sm:justify-center sm:gap-3 sm:overflow-visible">
          {categories.map(([category, icon]) => {
            const isActive = category === activeCategory;
            return <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`flex min-h-[37px] shrink-0 items-center gap-2 rounded-[11px] px-4 text-[0.65rem] font-medium whitespace-nowrap ${isActive ? 'bg-[#5b6150] text-white shadow-[0_2px_5px_rgba(47,47,40,0.16)]' : 'bg-[#f8f6f3] text-[#3d3c39] shadow-[0_1px_3px_rgba(45,42,37,0.04)]'}`}><span className="text-[1.05rem] leading-none">{icon}</span>{category}</button>;
          })}
        </div>

        <section id="itinerary-grid" className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {visibleItineraries.map(([title, location, category, label, difficulty, duration, description, image]) => (
            <article key={title} className="overflow-hidden rounded-[10px] border border-[#ddd9d2] bg-[#f9f7f4] shadow-[0_2px_5px_rgba(39,36,31,0.07)]">
              <div className="relative h-[116px] overflow-hidden"><img src={image} alt={title} className="h-full w-full object-cover" /><span className="absolute right-2.5 top-2.5 rounded-full bg-[#f2eee7]/90 px-2.5 py-1 text-[0.62rem] font-medium text-[#343430]">{duration}</span></div>
              <div className="relative min-h-[76px] px-3 py-2">
                <h2 className="brand-display text-[1.03rem] font-semibold leading-none text-[#2d2c29]">{title}</h2>
                <p className="mt-1.5 truncate text-[0.63rem] text-[#74736e]">{location}</p>
                <div className="mt-2 flex items-center gap-3 pr-8 text-[0.59rem] text-[#5e605b]"><span className="truncate"><MetaIcon>⌖</MetaIcon>{label}</span><span className="whitespace-nowrap"><MetaIcon>♧</MetaIcon>{difficulty}</span></div>
                <button type="button" onClick={() => setSelectedItinerary({ title, location, duration, description })} aria-label={`View ${title}`} className="absolute bottom-2.5 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#606653] text-[1rem] leading-none text-white">→</button>
              </div>
            </article>
          ))}
        </section>

        <footer id="heritage-stories" className="relative mt-4 flex min-h-[76px] items-center justify-between overflow-hidden rounded-[10px] bg-[#e9e5dc] px-7 py-4 sm:px-10">
          <div className="absolute right-1/4 top-0 h-full w-[310px] opacity-20 [background-image:repeating-radial-gradient(ellipse_at_center,_transparent_0,_transparent_18px,_#aca99f_19px,_transparent_20px)]" />
          <div className="relative hidden text-[#606653] sm:block"><span className="text-[2.8rem] leading-none">⌁</span></div>
          <div className="relative flex-1 text-center"><p className="script-text text-[1.35rem] leading-none text-[#5e5b55] sm:text-[1.55rem]">“More than a destination,</p><p className="script-text text-[1.35rem] leading-none text-[#5e5b55] sm:text-[1.55rem]">a journey through time, people and places.”</p><div className="mx-auto mt-2 h-px w-12 bg-[#b79662]" /></div>
          <div className="relative hidden w-[145px] text-right text-[0.48rem] uppercase tracking-[0.36em] text-[#777269] sm:block"><div>Lebanon</div><div className="mt-1">Always a story</div><div className="mt-1">To explore</div></div>
        </footer>

        {selectedItinerary && <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#24251f]/45 p-4" role="presentation" onClick={() => setSelectedItinerary(null)}><div role="dialog" aria-modal="true" aria-labelledby="itinerary-dialog-title" onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-[10px] border border-[#d8d1c8] bg-[#fbf8f3] p-6 shadow-2xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[0.62rem] uppercase tracking-[0.2em] text-[#8e805f]">{selectedItinerary.duration}</p><h2 id="itinerary-dialog-title" className="brand-display mt-1 text-3xl text-[#34342f]">{selectedItinerary.title}</h2></div><button type="button" onClick={() => setSelectedItinerary(null)} aria-label="Close itinerary details" className="text-xl text-[#55554d]">×</button></div><p className="mt-3 text-sm text-[#6d6b64]">{selectedItinerary.location}</p><p className="mt-5 text-sm leading-6 text-[#45443f]">{selectedItinerary.description}</p><button type="button" onClick={() => { setSelectedItinerary(null); scrollTo('itinerary-grid'); }} className="mt-6 rounded-full bg-[#606653] px-4 py-2 text-xs uppercase tracking-[0.12em] text-white">Back to itineraries</button></div></div>}
      </div>
    </main>
  );
}
