import { useState, useEffect, useRef, useCallback } from "react";

// ─── MOCK DATA ───────────────────────────────────────────────
const PLACES = [
  { id: 1, name: "The Hoxton", neighborhood: "Herengracht", category: "Coffee & Work", lat: 52.3676, lng: 4.8901, image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop", vibes: ["calm", "productive", "stylish"], price: "€€", rating: 4.7, badges: ["laptop-friendly", "great coffee", "stylish interior"], summary: "A serene canal-side workspace with impeccable flat whites and natural light that makes every Monday feel like a creative retreat.", bestFor: "Remote workers who appreciate design-forward spaces", hours: "7:00 – 22:00", scores: { calm: 85, style: 92, work: 95, romance: 40, energy: 55, value: 70, local: 60 }, idealMoments: ["Weekday mornings", "Afternoon focus sessions", "Solo creative work"], gallery: ["https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop","https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop","https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop"] },
  { id: 2, name: "Café de Ceuvel", neighborhood: "Noord", category: "Brunch", lat: 52.3906, lng: 4.9012, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop", vibes: ["creative", "local", "casual"], price: "€€", rating: 4.5, badges: ["hidden gem", "terrace", "local favorite"], summary: "A converted shipyard turned eco-café where Amsterdam's creative community gathers over organic brunch and waterfront views.", bestFor: "Creatives seeking inspiration and community", hours: "9:00 – 23:00", scores: { calm: 65, style: 78, work: 50, romance: 60, energy: 72, value: 80, local: 95 }, idealMoments: ["Weekend brunch", "Sunny afternoons", "Creative meetups"], gallery: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop","https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=500&fit=crop"] },
  { id: 3, name: "Bak Restaurant", neighborhood: "Westelijk Havengebied", category: "Restaurant", lat: 52.3862, lng: 4.8734, image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop", vibes: ["romantic", "intimate", "luxury"], price: "€€€", rating: 4.9, badges: ["date-worthy", "luxury feel", "stylish interior"], summary: "An intimate waterfront restaurant where minimalist Scandinavian design meets refined seasonal tasting menus. Perfect for a memorable evening.", bestFor: "Special occasions and romantic dinners", hours: "18:00 – 23:00", scores: { calm: 90, style: 96, work: 10, romance: 98, energy: 35, value: 55, local: 70 }, idealMoments: ["Anniversary dinners", "Date night", "Celebrating milestones"], gallery: ["https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=500&fit=crop","https://images.unsplash.com/photo-1550966871-3ed3cdb51f3a?w=800&h=500&fit=crop"] },
  { id: 4, name: "Lot Sixty One", neighborhood: "De Baarsjes", category: "Coffee", lat: 52.3655, lng: 4.8512, image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop", vibes: ["calm", "aesthetic", "productive"], price: "€", rating: 4.6, badges: ["great coffee", "quiet", "laptop-friendly"], summary: "Specialty coffee in its purest form. A minimalist haven where beans are roasted on-site and distractions simply don't exist.", bestFor: "Coffee purists and focused workers", hours: "8:00 – 17:00", scores: { calm: 92, style: 85, work: 88, romance: 30, energy: 35, value: 85, local: 75 }, idealMoments: ["Early morning rituals", "Deep work sessions"], gallery: ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=500&fit=crop"] },
  { id: 5, name: "Pllek", neighborhood: "NDSM Werf", category: "Beach Bar & Brunch", lat: 52.3984, lng: 4.8916, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop", vibes: ["lively", "social", "sunny"], price: "€€", rating: 4.3, badges: ["terrace", "lively", "local favorite"], summary: "An urban beach bar built from shipping containers overlooking the IJ river. Where Amsterdam comes to unwind with sand between their toes.", bestFor: "Social gatherings and sunny day escapes", hours: "9:30 – 01:00", scores: { calm: 40, style: 70, work: 20, romance: 55, energy: 90, value: 75, local: 88 }, idealMoments: ["Sunny weekends", "Sunset drinks", "Group hangouts"], gallery: ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop"] },
  { id: 6, name: "Vondelgym", neighborhood: "Oud-West", category: "Gym", lat: 52.3612, lng: 4.8690, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop", vibes: ["calm", "stylish", "luxury"], price: "€€€", rating: 4.8, badges: ["luxury feel", "quiet", "stylish interior"], summary: "A boutique fitness club that redefines the gym experience. Think marble showers, curated playlists, and trainers who remember your name.", bestFor: "Fitness enthusiasts who value aesthetics", hours: "6:30 – 22:00", scores: { calm: 75, style: 94, work: 10, romance: 20, energy: 80, value: 45, local: 65 }, idealMoments: ["Early morning workouts", "Lunch break sessions"], gallery: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=500&fit=crop"] },
  { id: 7, name: "Bar Centraal", neighborhood: "De Pijp", category: "Cocktail Bar", lat: 52.3547, lng: 4.8936, image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop", vibes: ["intimate", "romantic", "stylish"], price: "€€", rating: 4.6, badges: ["date-worthy", "hidden gem", "stylish interior"], summary: "A speakeasy-inspired cocktail bar tucked behind an unmarked door. Low lighting, craft cocktails, and conversations that last until closing.", bestFor: "Cocktail lovers and intimate evenings", hours: "17:00 – 01:00", scores: { calm: 70, style: 88, work: 5, romance: 92, energy: 60, value: 65, local: 82 }, idealMoments: ["Date nights", "Friday evenings", "Catching up with old friends"], gallery: ["https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=500&fit=crop"] },
  { id: 8, name: "Little Collins", neighborhood: "Jordaan", category: "Brunch & Lunch", lat: 52.3738, lng: 4.8821, image: "https://images.unsplash.com/photo-1525610553efeab8ce1890f9e4a9821f?w=600&h=400&fit=crop", vibes: ["cozy", "aesthetic", "casual"], price: "€€", rating: 4.4, badges: ["hidden gem", "great coffee", "local favorite"], summary: "An Australian-inspired brunch spot in the heart of Jordaan. Avocado toast elevated to art form, served with Melbourne-quality flat whites.", bestFor: "Weekend brunch rituals", hours: "8:30 – 16:00", scores: { calm: 72, style: 80, work: 45, romance: 55, energy: 60, value: 72, local: 78 }, idealMoments: ["Weekend brunch", "Rainy day comfort", "Catching up over coffee"], gallery: ["https://images.unsplash.com/photo-1525610553efeab8ce1890f9e4a9821f?w=800&h=500&fit=crop"] },
  { id: 9, name: "SkinnyFats", neighborhood: "Oud-Zuid", category: "Lunch", lat: 52.3498, lng: 4.8785, image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop", vibes: ["casual", "social", "lively"], price: "€", rating: 4.2, badges: ["local favorite", "casual", "terrace"], summary: "A neighborhood lunch counter where healthy bowls meet guilty pleasures. The kind of place where regulars have a usual.", bestFor: "Quick healthy lunches and casual meetups", hours: "11:00 – 21:00", scores: { calm: 50, style: 60, work: 30, romance: 25, energy: 75, value: 90, local: 85 }, idealMoments: ["Lunch breaks", "Post-workout meals"], gallery: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop"] },
  { id: 10, name: "REM Eiland", neighborhood: "Houthavens", category: "Restaurant", lat: 52.3891, lng: 4.8652, image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop", vibes: ["creative", "stylish", "intimate"], price: "€€€", rating: 4.7, badges: ["hidden gem", "stylish interior", "date-worthy"], summary: "Dining 22 meters above the IJ on a former pirate broadcasting platform. Panoramic views, seasonal menus, and a story at every table.", bestFor: "Impressing visitors and unforgettable dinners", hours: "12:00 – 23:00", scores: { calm: 65, style: 90, work: 15, romance: 88, energy: 55, value: 50, local: 70 }, idealMoments: ["Sunset dinners", "Special celebrations", "Impressing guests"], gallery: ["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop"] },
  { id: 11, name: "TrainMore Zuidas", neighborhood: "Zuidas", category: "Gym", lat: 52.3389, lng: 4.8730, image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop", vibes: ["lively", "social", "stylish"], price: "€€", rating: 4.4, badges: ["lively", "stylish interior", "local favorite"], summary: "A high-energy gym in Amsterdam's business district. Modern equipment, packed group classes, and a social atmosphere that keeps you coming back.", bestFor: "Social exercisers and group class lovers", hours: "6:00 – 23:00", scores: { calm: 30, style: 80, work: 5, romance: 15, energy: 95, value: 75, local: 70 }, idealMoments: ["Morning before work", "Lunch workouts", "Evening group classes"], gallery: ["https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=500&fit=crop"] },
  { id: 12, name: "The Breakfast Club", neighborhood: "De Pijp", category: "Brunch & Lunch", lat: 52.3540, lng: 4.8920, image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&h=400&fit=crop", vibes: ["lively", "casual", "social"], price: "€", rating: 4.3, badges: ["local favorite", "terrace", "casual"], summary: "All-day breakfast done right. From fluffy pancakes to loaded eggs benedict, with a buzzing terrace that spills onto the Albert Cuyp market.", bestFor: "Casual brunch with friends", hours: "8:00 – 16:00", scores: { calm: 35, style: 65, work: 20, romance: 40, energy: 80, value: 88, local: 90 }, idealMoments: ["Weekend brunch", "Market days", "Hangover mornings"], gallery: ["https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=500&fit=crop"] },
  { id: 13, name: "Club Paradiso", neighborhood: "Leidseplein", category: "Club & Music", lat: 52.3622, lng: 4.8832, image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&h=400&fit=crop", vibes: ["lively", "creative", "social"], price: "€€", rating: 4.6, badges: ["lively", "local favorite", "hidden gem"], summary: "A legendary music venue housed in a converted church. From indie to electronic, every night here feels like a moment in Amsterdam's cultural history.", bestFor: "Live music lovers and nightlife seekers", hours: "20:00 – 05:00", scores: { calm: 10, style: 82, work: 0, romance: 45, energy: 98, value: 70, local: 95 }, idealMoments: ["Friday nights", "Live shows", "Late night dancing"], gallery: ["https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&h=500&fit=crop"] },
  { id: 14, name: "De Foodhallen", neighborhood: "Oud-West", category: "Lunch & Food Hall", lat: 52.3628, lng: 4.8625, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop", vibes: ["social", "casual", "lively"], price: "€€", rating: 4.3, badges: ["local favorite", "casual", "lively"], summary: "Amsterdam's iconic indoor food market in a converted tram depot. Over 20 stalls serving everything from Vietnamese bao to Dutch bitterballen.", bestFor: "Groups who can't agree on one cuisine", hours: "11:00 – 23:30", scores: { calm: 25, style: 72, work: 10, romance: 35, energy: 85, value: 80, local: 85 }, idealMoments: ["Lunch with friends", "Rainy day plans", "Before going out"], gallery: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop"] },
  { id: 15, name: "Shelter Amsterdam", neighborhood: "Noord", category: "Club & Dance", lat: 52.3834, lng: 4.9018, image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=600&h=400&fit=crop", vibes: ["lively", "creative", "intimate"], price: "€€", rating: 4.5, badges: ["hidden gem", "lively", "local favorite"], summary: "An underground techno temple beneath the A'DAM Tower. Raw concrete walls, world-class sound system, and a crowd that dances until sunrise.", bestFor: "Techno purists and all-night dancers", hours: "23:00 – 07:00", scores: { calm: 5, style: 75, work: 0, romance: 30, energy: 99, value: 65, local: 90 }, idealMoments: ["Saturday nights", "After-hours", "When you need to lose yourself"], gallery: ["https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=500&fit=crop"] },
  { id: 16, name: "Staring at Jacob", neighborhood: "Centrum", category: "Lunch", lat: 52.3713, lng: 4.8912, image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop", vibes: ["calm", "aesthetic", "cozy"], price: "€€", rating: 4.5, badges: ["great coffee", "hidden gem", "stylish interior"], summary: "A canal-side lunch spot where seasonal salads and open sandwiches are served on handmade ceramics. Every dish looks like it belongs on a magazine cover.", bestFor: "Aesthetic lunch lovers and solo diners", hours: "10:00 – 17:00", scores: { calm: 80, style: 88, work: 55, romance: 60, energy: 40, value: 70, local: 72 }, idealMoments: ["Weekday lunch", "Solo dining", "Catching up one-on-one"], gallery: ["https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=500&fit=crop"] },
  { id: 17, name: "Boulderhal Amsterdam", neighborhood: "Nieuw-West", category: "Gym & Climbing", lat: 52.3580, lng: 4.8340, image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=400&fit=crop", vibes: ["social", "creative", "casual"], price: "€€", rating: 4.6, badges: ["local favorite", "lively", "casual"], summary: "A massive bouldering gym where the climbing community comes together. All skill levels welcome, with a café that's almost as good as the walls.", bestFor: "Active social hangs and beginner climbers", hours: "7:00 – 23:00", scores: { calm: 40, style: 60, work: 0, romance: 25, energy: 88, value: 80, local: 82 }, idealMoments: ["After work sessions", "Weekend mornings", "Active dates"], gallery: ["https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&h=500&fit=crop"] },
  { id: 18, name: "Dignita Hoftuin", neighborhood: "Centrum", category: "Brunch & Lunch", lat: 52.3660, lng: 4.9005, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop", vibes: ["calm", "aesthetic", "cozy"], price: "€€", rating: 4.7, badges: ["hidden gem", "terrace", "stylish interior"], summary: "Hidden in the garden of the Hermitage Museum, this social enterprise café serves stunning brunch in one of Amsterdam's most peaceful courtyards.", bestFor: "Secret garden brunch escapes", hours: "9:00 – 17:00", scores: { calm: 92, style: 85, work: 40, romance: 75, energy: 30, value: 72, local: 68 }, idealMoments: ["Sunny mornings", "Weekend brunch", "First dates"], gallery: ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop"] },
];

const COLLECTIONS = [
  { id: 1, title: "Best Work-Friendly Cafés", subtitle: "Quiet corners, fast WiFi, great coffee", count: 12, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop", color: "#C4705A" },
  { id: 2, title: "Romantic Dinner Spots", subtitle: "Intimate settings for unforgettable evenings", count: 8, image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=600&h=400&fit=crop", color: "#8B7355" },
  { id: 3, title: "Hidden Gems", subtitle: "The places only locals know about", count: 15, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop", color: "#6B7B6E" },
  { id: 4, title: "Stylish Brunch Places", subtitle: "Where aesthetics meet amazing food", count: 10, image: "https://images.unsplash.com/photo-1525610553efeab8ce1890f9e4a9821f?w=600&h=400&fit=crop", color: "#9B8579" },
  { id: 5, title: "Calm Gyms & Studios", subtitle: "Fitness without the chaos", count: 6, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop", color: "#7B8B8E" },
  { id: 6, title: "Best Nightlife & Dance", subtitle: "Where Amsterdam comes alive after dark", count: 9, image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&h=400&fit=crop", color: "#6B5B7B" },
  { id: 7, title: "Lunch Spots with Soul", subtitle: "Quick bites that feel like a proper meal", count: 11, image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=600&h=400&fit=crop", color: "#7B8B6B" },
];

const MOOD_TAGS = ["cozy","calm","stylish","productive","lively","romantic","hidden gem","luxury","local","casual","sunny","intimate","social","aesthetic","creative"];
const VIBE_FILTERS = ["calm","cozy","lively","romantic","productive","stylish","luxury","creative","casual","intimate"];
const CATEGORY_FILTERS = ["Coffee","Restaurant","Brunch","Bar","Gym","Lunch","Club","Food Hall"];
const BUDGET_FILTERS = ["€","€€","€€€"];
const BADGE_OPTIONS = ["laptop-friendly","great coffee","terrace","hidden gem","date-worthy","quiet","stylish interior","local favorite","luxury feel","lively"];

const SEARCH_SUGGESTIONS = [
  "A calm coffee place to work for 2 hours",
  "Romantic dinner, cozy lighting, not too expensive",
  "Hidden gems for lunch with stylish interior",
  "Best gym with a relaxed vibe, not too crowded",
  "Where to dance tonight, good music, local crowd",
  "Beach club vibe for brunch near the city",
];

const TESTIMONIALS = [
  { text: "Finally a way to find places based on actual vibe, not random reviews.", author: "Sophie M.", role: "Creative Director" },
  { text: "It feels like having a stylish local friend in every city.", author: "James L.", role: "Travel Photographer" },
  { text: "Way better than scrolling endlessly through maps and star ratings.", author: "Priya K.", role: "Remote Worker" },
];

// ─── ICONS ───────────────────────────────────────────────────
const Icons = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Heart: ({ filled }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={filled?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Map: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  List: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Arrow: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  Back: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Pin: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Sparkle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>,
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  Compass: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>,
  Bookmark: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Filter: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

// ─── STYLES ──────────────────────────────────────────────────
const globalCSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --bg: #FAF8F5;
  --bg-warm: #F5F0EB;
  --bg-card: #FFFFFF;
  --text: #1A1A1A;
  --text-secondary: #6B6560;
  --text-muted: #9B9590;
  --accent: #C4705A;
  --accent-light: #D4907E;
  --accent-bg: #FFF5F2;
  --sand: #E8DDD3;
  --sand-light: #F0E8E0;
  --border: #E8E2DC;
  --border-light: #F0EBE6;
  --serif: 'Cormorant Garamond', Georgia, serif;
  --sans: 'Outfit', system-ui, sans-serif;
  --shadow-sm: 0 1px 3px rgba(26,26,26,0.04), 0 1px 2px rgba(26,26,26,0.03);
  --shadow-md: 0 4px 16px rgba(26,26,26,0.06), 0 2px 6px rgba(26,26,26,0.04);
  --shadow-lg: 0 12px 40px rgba(26,26,26,0.08), 0 4px 12px rgba(26,26,26,0.04);
  --shadow-xl: 0 20px 60px rgba(26,26,26,0.1), 0 8px 20px rgba(26,26,26,0.05);
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
}

* { margin:0; padding:0; box-sizing:border-box; }

body {
  font-family: var(--sans);
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

::selection { background: var(--accent); color: white; }

@keyframes fadeUp {
  from { opacity:0; transform:translateY(20px); }
  to { opacity:1; transform:translateY(0); }
}
@keyframes fadeIn {
  from { opacity:0; }
  to { opacity:1; }
}
@keyframes slideUp {
  from { opacity:0; transform:translateY(40px); }
  to { opacity:1; transform:translateY(0); }
}
@keyframes pulse {
  0%,100% { opacity:0.4; }
  50% { opacity:0.7; }
}
@keyframes shimmer {
  0% { background-position:-200% 0; }
  100% { background-position:200% 0; }
}
@keyframes scaleIn {
  from { opacity:0; transform:scale(0.95); }
  to { opacity:1; transform:scale(1); }
}
@keyframes heartBeat {
  0% { transform:scale(1); }
  25% { transform:scale(1.3); }
  50% { transform:scale(1); }
  75% { transform:scale(1.15); }
  100% { transform:scale(1); }
}
@keyframes slideDown {
  from { opacity:0; transform:translateY(-10px); }
  to { opacity:1; transform:translateY(0); }
}

.fade-up { animation: fadeUp 0.6s ease both; }
.fade-up-1 { animation: fadeUp 0.6s ease 0.1s both; }
.fade-up-2 { animation: fadeUp 0.6s ease 0.2s both; }
.fade-up-3 { animation: fadeUp 0.6s ease 0.3s both; }
.fade-up-4 { animation: fadeUp 0.6s ease 0.4s both; }
.fade-up-5 { animation: fadeUp 0.6s ease 0.5s both; }
.fade-in { animation: fadeIn 0.4s ease both; }
.scale-in { animation: scaleIn 0.3s ease both; }
.slide-down { animation: slideDown 0.3s ease both; }

.skeleton {
  background: linear-gradient(90deg, var(--sand-light) 25%, var(--sand) 50%, var(--sand-light) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-sm);
}

::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--sand); border-radius:3px; }
::-webkit-scrollbar-thumb:hover { background:var(--text-muted); }
`;

// ─── UTILITY COMPONENTS ──────────────────────────────────────
function Logo({ onClick }) {
  return (
    <div onClick={onClick} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:32, height:32, borderRadius:"50%", background:"linear-gradient(135deg, var(--accent), var(--accent-light))", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icons.Compass />
      </div>
      <span style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:600, color:"var(--text)", letterSpacing:"-0.02em" }}>VibeSpot</span>
    </div>
  );
}

function VibeTag({ tag, selected, onClick, small }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? "5px 12px" : "7px 16px",
      borderRadius: 50,
      border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
      background: selected ? "var(--accent-bg)" : "transparent",
      color: selected ? "var(--accent)" : "var(--text-secondary)",
      fontSize: small ? 12 : 13,
      fontFamily: "var(--sans)",
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    }}>{tag}</button>
  );
}

function Badge({ text }) {
  const colors = {
    "laptop-friendly": "#5B7F6E", "great coffee": "#8B6B4A", "terrace": "#6B8B7B",
    "hidden gem": "#9B7B5A", "date-worthy": "#A5606B", "quiet": "#7B8B9E",
    "stylish interior": "#8B7B9E", "local favorite": "#7B8B6B", "luxury feel": "#8B7560",
    "lively": "#C4705A", "casual": "#8B8B7B",
  };
  const c = colors[text] || "var(--text-muted)";
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, color: c, padding: "3px 10px",
      borderRadius: 50, background: `${c}12`, letterSpacing: "0.02em",
    }}>{text}</span>
  );
}

function ScoreBar({ label, value }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
      <span style={{ fontSize:13, color:"var(--text-secondary)", width:100, fontWeight:500 }}>{label}</span>
      <div style={{ flex:1, height:6, background:"var(--sand-light)", borderRadius:3, overflow:"hidden" }}>
        <div style={{ width:`${value}%`, height:"100%", background: value > 75 ? "var(--accent)" : value > 50 ? "var(--accent-light)" : "var(--sand)", borderRadius:3, transition:"width 0.8s ease" }} />
      </div>
      <span style={{ fontSize:12, color:"var(--text-muted)", width:30, textAlign:"right", fontWeight:500 }}>{value}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:24, padding:"0 0 40px" }}>
      {[1,2,3,4,5,6].map(i => (
        <div key={i} style={{ borderRadius:"var(--radius-lg)", overflow:"hidden", background:"var(--bg-card)", boxShadow:"var(--shadow-sm)" }}>
          <div className="skeleton" style={{ height:200, width:"100%" }} />
          <div style={{ padding:20 }}>
            <div className="skeleton" style={{ height:20, width:"70%", marginBottom:10 }} />
            <div className="skeleton" style={{ height:14, width:"40%", marginBottom:16 }} />
            <div className="skeleton" style={{ height:14, width:"90%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── GOOGLE MAP ──────────────────────────────────────────────
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (window.google?.maps) { setLoaded(true); return; }
    if (!MAPS_KEY) return;
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      const check = setInterval(() => { if (window.google?.maps) { setLoaded(true); clearInterval(check); } }, 100);
      return () => clearInterval(check);
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);
  return loaded;
}

function GoogleMap({ places, singlePlace, height = 400, onMarkerClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const mapsLoaded = useGoogleMaps();

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return;

    const spots = singlePlace ? [singlePlace] : (places || []);
    if (spots.length === 0) return;

    const center = singlePlace
      ? { lat: singlePlace.lat, lng: singlePlace.lng }
      : { lat: 52.3676, lng: 4.8936 };

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: singlePlace ? 15 : 13,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#f5f0eb" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#6b6560" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#faf8f5" }] },
          { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
          { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e8e2dc" }] },
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#d4e4ed" }] },
          { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#dce8d8" }] },
          { featureType: "poi.business", stylers: [{ visibility: "off" }] },
          { featureType: "transit", stylers: [{ visibility: "off" }] },
        ],
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
      });
    } else {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(singlePlace ? 15 : 13);
    }

    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    spots.forEach(place => {
      if (!place.lat || !place.lng) return;
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: mapInstanceRef.current,
        title: place.name,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: singlePlace ? 10 : 8,
          fillColor: "#C4705A",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-family:Outfit,sans-serif;padding:4px 2px;">
          <strong style="font-size:14px;color:#1A1A1A;">${place.name}</strong>
          <p style="font-size:12px;color:#6B6560;margin:2px 0 0;">${place.neighborhood} · ${place.price} · ★ ${place.rating}</p>
        </div>`,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, marker);
        if (onMarkerClick) onMarkerClick(place);
      });

      markersRef.current.push(marker);
    });

    if (!singlePlace && spots.length > 1) {
      const bounds = new window.google.maps.LatLngBounds();
      spots.forEach(p => { if (p.lat && p.lng) bounds.extend({ lat: p.lat, lng: p.lng }); });
      mapInstanceRef.current.fitBounds(bounds, 60);
    }
  }, [mapsLoaded, places, singlePlace]);

  if (!MAPS_KEY) {
    return (
      <div style={{ borderRadius:"var(--radius-lg)", height, background:"var(--sand-light)", display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid var(--border)" }}>
        <div style={{ textAlign:"center", color:"var(--text-muted)" }}>
          <Icons.Map /> <p style={{ fontSize:13, marginTop:6 }}>Map — connect Google Maps API to enable</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ borderRadius:"var(--radius-lg)", overflow:"hidden", height, border:"1px solid var(--border)", position:"relative" }}>
      {!mapsLoaded && (
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"var(--sand-light)", zIndex:1 }}>
          <p style={{ fontSize:13, color:"var(--text-muted)" }}>Loading map...</p>
        </div>
      )}
      <div ref={mapRef} style={{ width:"100%", height:"100%" }} />
    </div>
  );
}

// ─── PLACE CARD ──────────────────────────────────────────────
function PlaceCard({ place, onSelect, onSave, saved }) {
  const [hover, setHover] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--bg-card)",
        boxShadow: hover ? "var(--shadow-lg)" : "var(--shadow-sm)",
        cursor: "pointer",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        transform: hover ? "translateY(-4px)" : "none",
      }}
    >
      <div style={{ position:"relative", overflow:"hidden" }} onClick={() => onSelect(place)}>
        <img src={place.image} alt={place.name} style={{
          width:"100%", height:210, objectFit:"cover",
          transition:"transform 0.5s ease",
          transform: hover ? "scale(1.05)" : "scale(1)",
        }} />
        <div style={{ position:"absolute", top:12, right:12 }}>
          <button onClick={e => { e.stopPropagation(); setHeartAnim(true); setTimeout(()=>setHeartAnim(false),400); onSave(place.id); }}
            style={{
              width:36, height:36, borderRadius:"50%", border:"none", cursor:"pointer",
              background:"rgba(255,255,255,0.9)", backdropFilter:"blur(8px)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color: saved ? "var(--accent)" : "var(--text-muted)",
              animation: heartAnim ? "heartBeat 0.4s ease" : "none",
              transition:"color 0.2s",
            }}>
            <Icons.Heart filled={saved} />
          </button>
        </div>
        <div style={{ position:"absolute", top:12, left:12, display:"flex", gap:6 }}>
          <span style={{ fontSize:11, fontWeight:600, color:"white", padding:"4px 10px", borderRadius:50, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)" }}>{place.price}</span>
          <span style={{ fontSize:11, fontWeight:600, color:"white", padding:"4px 10px", borderRadius:50, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", gap:3 }}>
            <Icons.Star /> {place.rating}
          </span>
        </div>
      </div>
      <div style={{ padding:"18px 20px 20px" }} onClick={() => onSelect(place)}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
          <h3 style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:600, letterSpacing:"-0.01em" }}>{place.name}</h3>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, color:"var(--text-muted)", fontSize:13 }}>
          <Icons.Pin /> {place.neighborhood} · {place.category}
        </div>
        <p style={{ fontSize:13.5, lineHeight:1.55, color:"var(--text-secondary)", marginBottom:14, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
          {place.summary}
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
          {place.badges.slice(0,3).map(b => <Badge key={b} text={b} />)}
        </div>
      </div>
    </div>
  );
}

// ─── COLLECTION CARD ─────────────────────────────────────────
function CollectionCard({ collection, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: "var(--radius-lg)", overflow:"hidden", cursor:"pointer",
        position:"relative", minHeight:260,
        transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
        transform: hover ? "translateY(-4px)" : "none",
        boxShadow: hover ? "var(--shadow-lg)" : "var(--shadow-md)",
      }}>
      <img src={collection.image} alt={collection.title} style={{
        width:"100%", height:"100%", objectFit:"cover", position:"absolute",
        transition:"transform 0.6s ease", transform: hover ? "scale(1.08)" : "scale(1)",
      }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:24 }}>
        <p style={{ fontSize:12, fontWeight:500, color:"rgba(255,255,255,0.7)", marginBottom:4, letterSpacing:"0.04em", textTransform:"uppercase" }}>{collection.count} places</p>
        <h3 style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:600, color:"white", marginBottom:4, letterSpacing:"-0.01em" }}>{collection.title}</h3>
        <p style={{ fontSize:13, color:"rgba(255,255,255,0.75)" }}>{collection.subtitle}</p>
      </div>
    </div>
  );
}

// ─── SEARCH BAR ──────────────────────────────────────────────
function SearchBar({ onSearch, large, initialValue, autoFocus }) {
  const [query, setQuery] = useState(initialValue || "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { if (autoFocus && inputRef.current) inputRef.current.focus(); }, [autoFocus]);

  const handleSubmit = (q) => {
    const val = q || query;
    if (val.trim()) onSearch(val.trim());
  };

  return (
    <div style={{ position:"relative", width:"100%", zIndex:50 }}>
      <div style={{
        display:"flex", alignItems:"center", gap:12,
        background: "var(--bg-card)",
        border: `2px solid ${focused ? "var(--accent)" : "var(--border)"}`,
        borderRadius: large ? "var(--radius-xl)" : "var(--radius-lg)",
        padding: large ? "16px 20px 16px 24px" : "12px 16px 12px 20px",
        boxShadow: focused ? "var(--shadow-lg), 0 0 0 4px var(--accent-bg)" : "var(--shadow-md)",
        transition: "all 0.3s ease",
      }}>
        <div style={{ color: focused ? "var(--accent)" : "var(--text-muted)", transition:"color 0.2s" }}>
          <Icons.Sparkle />
        </div>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="Describe your ideal place..."
          style={{
            flex:1, border:"none", outline:"none", background:"transparent",
            fontSize: large ? 17 : 15, fontFamily:"var(--sans)", fontWeight:400,
            color:"var(--text)", letterSpacing:"-0.01em",
          }}
        />
        <button onClick={() => handleSubmit()} style={{
          padding: large ? "10px 24px" : "8px 18px",
          borderRadius: 50, border:"none", cursor:"pointer",
          background: "var(--accent)", color:"white",
          fontSize:14, fontWeight:600, fontFamily:"var(--sans)",
          transition:"all 0.2s ease",
          display:"flex", alignItems:"center", gap:6,
        }}>
          <Icons.Search /> Search
        </button>
      </div>
      {focused && !query && (
        <div className="slide-down" style={{
          position:"absolute", top:"100%", left:0, right:0, marginTop:8,
          background:"var(--bg-card)", borderRadius:"var(--radius-lg)",
          boxShadow:"var(--shadow-lg)", padding:8, zIndex:999,
        }}>
          <p style={{ fontSize:12, fontWeight:500, color:"var(--text-muted)", padding:"8px 12px", letterSpacing:"0.04em", textTransform:"uppercase" }}>Try searching</p>
          {SEARCH_SUGGESTIONS.map((s,i) => (
            <button key={i} onClick={() => { setQuery(s); handleSubmit(s); }}
              style={{
                display:"flex", alignItems:"center", gap:10, width:"100%",
                padding:"10px 12px", border:"none", background:"transparent",
                cursor:"pointer", borderRadius:"var(--radius-sm)",
                fontSize:14, color:"var(--text-secondary)", textAlign:"left",
                fontFamily:"var(--sans)", transition:"background 0.15s",
              }}
              onMouseEnter={e => e.target.style.background="var(--bg-warm)"}
              onMouseLeave={e => e.target.style.background="transparent"}
            >
              <span style={{ color:"var(--accent)" }}><Icons.Sparkle /></span> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────
function Navbar({ page, navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems = [
    { label:"Explore", page:"home" },
    { label:"Collections", page:"collections" },
    { label:"AI Search", page:"search" },
    { label:"Favorites", page:"favorites" },
  ];

  return (
    <>
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        padding: scrolled ? "12px 24px" : "16px 24px",
        background: scrolled ? "rgba(250,248,245,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(1.2)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-light)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Logo onClick={() => navigate("home")} />
          <div style={{ display:"flex", alignItems:"center", gap:6 }} className="desktop-nav">
            {navItems.map(item => (
              <button key={item.page} onClick={() => navigate(item.page)}
                style={{
                  padding:"8px 16px", border:"none", borderRadius:50,
                  background: page === item.page ? "var(--accent-bg)" : "transparent",
                  color: page === item.page ? "var(--accent)" : "var(--text-secondary)",
                  fontSize:14, fontWeight:500, fontFamily:"var(--sans)", cursor:"pointer",
                  transition:"all 0.2s",
                }}>{item.label}</button>
            ))}
            <div style={{ width:1, height:24, background:"var(--border)", margin:"0 8px" }} />
            <button onClick={() => navigate("profile")} style={{
              width:36, height:36, borderRadius:"50%", border:"2px solid var(--border)",
              background:"var(--sand-light)", cursor:"pointer", display:"flex",
              alignItems:"center", justifyContent:"center", color:"var(--text-muted)",
            }}><Icons.User /></button>
          </div>
          <button onClick={() => setMobileMenu(true)} className="mobile-menu-btn" style={{
            display:"none", border:"none", background:"none", cursor:"pointer", color:"var(--text)",
          }}><Icons.Menu /></button>
        </div>
      </nav>

      {mobileMenu && (
        <div className="fade-in" style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.3)", backdropFilter:"blur(4px)" }}
          onClick={() => setMobileMenu(false)}>
          <div className="scale-in" onClick={e => e.stopPropagation()} style={{
            position:"absolute", top:16, right:16, left:16,
            background:"var(--bg-card)", borderRadius:"var(--radius-xl)",
            padding:24, boxShadow:"var(--shadow-xl)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <Logo onClick={() => { navigate("home"); setMobileMenu(false); }} />
              <button onClick={() => setMobileMenu(false)} style={{ border:"none", background:"none", cursor:"pointer", color:"var(--text)" }}><Icons.Close /></button>
            </div>
            {navItems.map(item => (
              <button key={item.page} onClick={() => { navigate(item.page); setMobileMenu(false); }}
                style={{
                  display:"block", width:"100%", padding:"14px 0", border:"none",
                  background:"transparent", textAlign:"left", fontSize:17, fontWeight:500,
                  color: page === item.page ? "var(--accent)" : "var(--text)",
                  fontFamily:"var(--sans)", cursor:"pointer", borderBottom:"1px solid var(--border-light)",
                }}>{item.label}</button>
            ))}
            <button onClick={() => { navigate("profile"); setMobileMenu(false); }}
              style={{ display:"block", width:"100%", padding:"14px 0", border:"none", background:"transparent", textAlign:"left", fontSize:17, fontWeight:500, color:"var(--text)", fontFamily:"var(--sans)", cursor:"pointer" }}>
              Profile
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:768px) {
          .desktop-nav { display:none !important; }
          .mobile-menu-btn { display:flex !important; }
        }
      `}</style>
    </>
  );
}

// ─── MOBILE BOTTOM NAV ──────────────────────────────────────
function MobileBottomNav({ page, navigate }) {
  const items = [
    { icon: <Icons.Home />, label:"Home", p:"home" },
    { icon: <Icons.Compass />, label:"Explore", p:"search" },
    { icon: <Icons.Bookmark />, label:"Saved", p:"favorites" },
    { icon: <Icons.User />, label:"Profile", p:"profile" },
  ];
  return (
    <>
      <div className="mobile-bottom-nav" style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:1000,
        background:"rgba(250,248,245,0.95)", backdropFilter:"blur(20px)",
        borderTop:"1px solid var(--border-light)",
        display:"none", padding:"8px 0 max(8px, env(safe-area-inset-bottom))",
      }}>
        <div style={{ display:"flex", justifyContent:"space-around" }}>
          {items.map(item => (
            <button key={item.p} onClick={() => navigate(item.p)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              border:"none", background:"transparent", cursor:"pointer", padding:"6px 12px",
              color: page === item.p ? "var(--accent)" : "var(--text-muted)",
              transition:"color 0.2s",
            }}>
              {item.icon}
              <span style={{ fontSize:10, fontWeight:600, letterSpacing:"0.02em" }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px) { .mobile-bottom-nav { display:block !important; } }`}</style>
    </>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background:"var(--text)", color:"rgba(255,255,255,0.7)", padding:"60px 24px 40px", marginTop:80 }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:40, marginBottom:40 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--accent)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"white", fontSize:12 }}><Icons.Compass /></span>
              </div>
              <span style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:600, color:"white" }}>VibeSpot</span>
            </div>
            <p style={{ fontSize:13, lineHeight:1.6 }}>Find places that match your mood. Discover cafés, restaurants, and hidden gems by atmosphere, vibe, and intent.</p>
          </div>
          <div>
            <h4 style={{ fontSize:13, fontWeight:600, color:"white", marginBottom:14, letterSpacing:"0.04em", textTransform:"uppercase" }}>Discover</h4>
            {["Explore Places","Collections","AI Search","Cities","How It Works"].map(l => (
              <p key={l} style={{ fontSize:13, marginBottom:8, cursor:"pointer", transition:"color 0.2s" }}
                onMouseEnter={e => e.target.style.color="white"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.7)"}>{l}</p>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize:13, fontWeight:600, color:"white", marginBottom:14, letterSpacing:"0.04em", textTransform:"uppercase" }}>Company</h4>
            {["About","Careers","Blog","Press","Contact"].map(l => (
              <p key={l} style={{ fontSize:13, marginBottom:8, cursor:"pointer", transition:"color 0.2s" }}
                onMouseEnter={e => e.target.style.color="white"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.7)"}>{l}</p>
            ))}
          </div>
          <div>
            <h4 style={{ fontSize:13, fontWeight:600, color:"white", marginBottom:14, letterSpacing:"0.04em", textTransform:"uppercase" }}>Legal</h4>
            {["Privacy Policy","Terms of Service","Cookie Policy","Accessibility"].map(l => (
              <p key={l} style={{ fontSize:13, marginBottom:8, cursor:"pointer", transition:"color 0.2s" }}
                onMouseEnter={e => e.target.style.color="white"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.7)"}>{l}</p>
            ))}
          </div>
        </div>
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.12)", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ fontSize:12 }}>© 2026 VibeSpot. All rights reserved.</p>
          <div style={{ display:"flex", gap:16 }}>
            {["Instagram","Twitter","TikTok","LinkedIn"].map(s => (
              <span key={s} style={{ fontSize:12, cursor:"pointer", transition:"color 0.2s" }}
                onMouseEnter={e => e.target.style.color="white"} onMouseLeave={e => e.target.style.color="rgba(255,255,255,0.7)"}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ONBOARDING MODAL ────────────────────────────────────────
function OnboardingModal({ onComplete }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ vibes:[], budget:"€€", city:"Amsterdam", searching:[] });

  const steps = [
    { q:"What kind of vibes do you love?", key:"vibes", options:["cozy","calm","stylish","lively","luxury","creative","romantic","casual","intimate","local"], multi:true },
    { q:"What's your typical budget?", key:"budget", options:["€ Budget-friendly","€€ Mid-range","€€€ Premium"], multi:false },
    { q:"What do you usually search for?", key:"searching", options:["Coffee spots","Brunch places","Dinner restaurants","Cocktail bars","Gyms & fitness","Hidden gems","Work spaces","Nightlife"], multi:true },
  ];

  const current = steps[step];
  const isSelected = (opt) => {
    if (current.multi) return answers[current.key].includes(opt);
    return answers[current.key] === opt;
  };
  const toggle = (opt) => {
    if (current.multi) {
      setAnswers(a => ({ ...a, [current.key]: a[current.key].includes(opt) ? a[current.key].filter(v=>v!==opt) : [...a[current.key], opt] }));
    } else {
      setAnswers(a => ({ ...a, [current.key]: opt }));
    }
  };

  return (
    <div className="fade-in" style={{ position:"fixed", inset:0, zIndex:3000, background:"rgba(0,0,0,0.4)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div className="scale-in" style={{ background:"var(--bg-card)", borderRadius:"var(--radius-xl)", padding:"40px 36px", maxWidth:520, width:"100%", boxShadow:"var(--shadow-xl)" }}>
        <div style={{ display:"flex", gap:6, marginBottom:32 }}>
          {steps.map((_,i) => (
            <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i <= step ? "var(--accent)" : "var(--sand)", transition:"background 0.3s" }} />
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
          <Icons.Sparkle /><span style={{ fontSize:12, fontWeight:600, color:"var(--accent)", letterSpacing:"0.06em", textTransform:"uppercase" }}>Personalize</span>
        </div>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:28, fontWeight:600, marginBottom:8, letterSpacing:"-0.02em" }}>{current.q}</h2>
        <p style={{ fontSize:14, color:"var(--text-muted)", marginBottom:28 }}>{current.multi ? "Select all that apply" : "Choose one"}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:36 }}>
          {current.options.map(opt => (
            <button key={opt} onClick={() => toggle(opt)} style={{
              padding:"10px 20px", borderRadius:50, cursor:"pointer",
              border: `2px solid ${isSelected(opt) ? "var(--accent)" : "var(--border)"}`,
              background: isSelected(opt) ? "var(--accent-bg)" : "transparent",
              color: isSelected(opt) ? "var(--accent)" : "var(--text-secondary)",
              fontSize:14, fontWeight:500, fontFamily:"var(--sans)",
              transition:"all 0.2s",
            }}>{opt}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {step > 0 && (
            <button onClick={() => setStep(s=>s-1)} style={{
              padding:"12px 24px", borderRadius:50, border:"2px solid var(--border)",
              background:"transparent", cursor:"pointer", fontSize:14, fontWeight:600,
              fontFamily:"var(--sans)", color:"var(--text-secondary)",
            }}>Back</button>
          )}
          <button onClick={() => step < steps.length - 1 ? setStep(s=>s+1) : onComplete(answers)}
            style={{
              flex:1, padding:"12px 24px", borderRadius:50, border:"none",
              background:"var(--accent)", color:"white", cursor:"pointer",
              fontSize:14, fontWeight:600, fontFamily:"var(--sans)",
              transition:"all 0.2s",
            }}>
            {step < steps.length - 1 ? "Continue" : "Start Exploring"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ────────────────────────────────────────────
function LandingPage({ navigate, onSearch, savedIds, onSave }) {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { setHeroVisible(true); }, []);

  return (
    <div style={{ paddingBottom:60 }}>
      {/* HERO */}
      <section style={{
        minHeight:"92vh", display:"flex", flexDirection:"column", justifyContent:"center",
        alignItems:"center", textAlign:"center", padding:"120px 24px 60px",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:"-20%", right:"-10%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(196,112,90,0.06) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"-10%", left:"-5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(232,221,211,0.4) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div className={heroVisible ? "fade-up" : ""} style={{ opacity: heroVisible ? undefined : 0 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 16px", borderRadius:50, background:"var(--accent-bg)", marginBottom:28 }}>
            <Icons.Sparkle />
            <span style={{ fontSize:13, fontWeight:600, color:"var(--accent)", letterSpacing:"0.02em" }}>AI-Powered Discovery</span>
          </div>
        </div>

        <h1 className={heroVisible ? "fade-up-1" : ""} style={{
          fontFamily:"var(--serif)", fontSize:"clamp(42px, 7vw, 72px)", fontWeight:600,
          lineHeight:1.08, letterSpacing:"-0.03em", maxWidth:800, marginBottom:20,
          opacity: heroVisible ? undefined : 0,
        }}>
          Find places that<br />match your <span style={{ color:"var(--accent)", fontStyle:"italic" }}>mood</span>.
        </h1>

        <p className={heroVisible ? "fade-up-2" : ""} style={{
          fontSize:"clamp(16px, 2vw, 19px)", lineHeight:1.6, color:"var(--text-secondary)",
          maxWidth:540, marginBottom:40, fontWeight:400,
          opacity: heroVisible ? undefined : 0,
        }}>
          Search cafés, restaurants, gyms, brunch spots, and hidden gems by atmosphere, vibe, and intent — powered by AI.
        </p>

        <div className={heroVisible ? "fade-up-3" : ""} style={{ width:"100%", maxWidth:600, marginBottom:20, opacity: heroVisible ? undefined : 0, position:"relative", zIndex:50 }}>
          <SearchBar onSearch={onSearch} large />
        </div>

        <div className={heroVisible ? "fade-up-4" : ""} style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8, marginBottom:0, opacity: heroVisible ? undefined : 0 }}>
          {["cozy coffee spot","romantic dinner","productive workspace","hidden gem brunch","stylish cocktails","best gym nearby","dance tonight"].map(tag => (
            <button key={tag} onClick={() => onSearch(tag)} style={{
              padding:"7px 16px", borderRadius:50, border:"1.5px solid var(--border)",
              background:"transparent", cursor:"pointer", fontSize:13, fontWeight:500,
              color:"var(--text-muted)", fontFamily:"var(--sans)", transition:"all 0.2s",
            }}
            onMouseEnter={e => { e.target.style.borderColor="var(--accent)"; e.target.style.color="var(--accent)"; }}
            onMouseLeave={e => { e.target.style.borderColor="var(--border)"; e.target.style.color="var(--text-muted)"; }}
            >{tag}</button>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth:1000, margin:"0 auto 80px", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <p style={{ fontSize:12, fontWeight:600, color:"var(--accent)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>How It Works</p>
          <h2 style={{ fontFamily:"var(--serif)", fontSize:"clamp(28px, 4vw, 38px)", fontWeight:600, letterSpacing:"-0.02em" }}>Three steps to your perfect spot</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:24 }}>
          {[
            { num:"01", title:"Describe your mood", desc:"Tell us what you're feeling. Want something cozy? Productive? Romantic? Just say it in your own words." },
            { num:"02", title:"AI finds your match", desc:"Our AI interprets your intent, considering atmosphere, style, price, and location to find the perfect places." },
            { num:"03", title:"Discover & save", desc:"Browse curated results, explore vibe details, and save your favorites to personal collections." },
          ].map((s,i) => (
            <div key={i} style={{ padding:32, borderRadius:"var(--radius-lg)", background:"var(--bg-card)", boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
              <span style={{ fontFamily:"var(--serif)", fontSize:40, fontWeight:700, color:"var(--accent)", opacity:0.3, lineHeight:1 }}>{s.num}</span>
              <h3 style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:600, margin:"12px 0 8px", letterSpacing:"-0.01em" }}>{s.title}</h3>
              <p style={{ fontSize:14, lineHeight:1.6, color:"var(--text-secondary)" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS */}
      <section style={{ maxWidth:1200, margin:"0 auto 80px", padding:"0 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32 }}>
          <div>
            <p style={{ fontSize:12, fontWeight:600, color:"var(--accent)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Curated</p>
            <h2 style={{ fontFamily:"var(--serif)", fontSize:"clamp(28px, 4vw, 38px)", fontWeight:600, letterSpacing:"-0.02em" }}>Trending collections</h2>
          </div>
          <button onClick={() => navigate("collections")} style={{
            fontSize:14, fontWeight:500, color:"var(--accent)", background:"none", border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", gap:4,
          }}>View all <Icons.Arrow /></button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20 }}>
          {COLLECTIONS.slice(0,4).map(c => <CollectionCard key={c.id} collection={c} onClick={() => onSearch(c.title)} />)}
        </div>
      </section>

      {/* FEATURED PLACES */}
      <section style={{ maxWidth:1200, margin:"0 auto 80px", padding:"0 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32 }}>
          <div>
            <p style={{ fontSize:12, fontWeight:600, color:"var(--accent)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Featured</p>
            <h2 style={{ fontFamily:"var(--serif)", fontSize:"clamp(28px, 4vw, 38px)", fontWeight:600, letterSpacing:"-0.02em" }}>Places you'll love</h2>
          </div>
          <button onClick={() => navigate("search")} style={{ fontSize:14, fontWeight:500, color:"var(--accent)", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
            Explore all <Icons.Arrow />
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:24 }}>
          {PLACES.slice(0,6).map(p => (
            <PlaceCard key={p.id} place={p} onSelect={() => navigate("detail", p)} onSave={onSave} saved={savedIds.has(p.id)} />
          ))}
        </div>
      </section>

      {/* VIBE SEARCH */}
      <section style={{ maxWidth:1000, margin:"0 auto 80px", padding:"0 24px", textAlign:"center" }}>
        <p style={{ fontSize:12, fontWeight:600, color:"var(--accent)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>Mood Search</p>
        <h2 style={{ fontFamily:"var(--serif)", fontSize:"clamp(28px, 4vw, 38px)", fontWeight:600, letterSpacing:"-0.02em", marginBottom:12 }}>Search by vibe</h2>
        <p style={{ fontSize:15, color:"var(--text-secondary)", marginBottom:32, maxWidth:500, margin:"0 auto 32px" }}>Skip the categories. Tell us the feeling you want and we'll do the rest.</p>
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:10 }}>
          {MOOD_TAGS.map(tag => (
            <button key={tag} onClick={() => onSearch(tag)} style={{
              padding:"10px 22px", borderRadius:50, border:"2px solid var(--border)",
              background:"transparent", cursor:"pointer", fontSize:14, fontWeight:500,
              color:"var(--text-secondary)", fontFamily:"var(--sans)", transition:"all 0.25s",
            }}
            onMouseEnter={e => { e.target.style.borderColor="var(--accent)"; e.target.style.color="var(--accent)"; e.target.style.background="var(--accent-bg)"; }}
            onMouseLeave={e => { e.target.style.borderColor="var(--border)"; e.target.style.color="var(--text-secondary)"; e.target.style.background="transparent"; }}
            >{tag}</button>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section style={{ background:"var(--bg-warm)", padding:"60px 24px", marginBottom:80 }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:32, textAlign:"center" }}>
          {[
            { num:"2,400+", label:"Places curated" },
            { num:"15", label:"Mood dimensions" },
            { num:"12", label:"Cities explored" },
            { num:"50K+", label:"Vibes matched" },
          ].map((s,i) => (
            <div key={i}>
              <p style={{ fontFamily:"var(--serif)", fontSize:36, fontWeight:700, color:"var(--accent)", letterSpacing:"-0.02em" }}>{s.num}</p>
              <p style={{ fontSize:14, color:"var(--text-secondary)", fontWeight:500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth:1000, margin:"0 auto 80px", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <p style={{ fontSize:12, fontWeight:600, color:"var(--accent)", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>What People Say</p>
          <h2 style={{ fontFamily:"var(--serif)", fontSize:"clamp(28px, 4vw, 38px)", fontWeight:600, letterSpacing:"-0.02em" }}>Loved by explorers</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:20 }}>
          {TESTIMONIALS.map((t,i) => (
            <div key={i} style={{ padding:28, borderRadius:"var(--radius-lg)", background:"var(--bg-card)", boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
              <p style={{ fontFamily:"var(--serif)", fontSize:18, fontStyle:"italic", lineHeight:1.5, color:"var(--text)", marginBottom:16 }}>"{t.text}"</p>
              <div>
                <p style={{ fontSize:14, fontWeight:600, color:"var(--text)" }}>{t.author}</p>
                <p style={{ fontSize:13, color:"var(--text-muted)" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth:800, margin:"0 auto", padding:"0 24px", textAlign:"center" }}>
        <div style={{ background:"var(--text)", borderRadius:"var(--radius-xl)", padding:"60px 40px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"-50%", right:"-20%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle, rgba(196,112,90,0.2) 0%, transparent 70%)" }} />
          <h2 style={{ fontFamily:"var(--serif)", fontSize:"clamp(26px, 4vw, 36px)", fontWeight:600, color:"white", marginBottom:12, letterSpacing:"-0.02em", position:"relative" }}>
            Ready to discover your next favorite place?
          </h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.7)", marginBottom:28, position:"relative" }}>Search by mood, vibe, and feeling — not stars and categories.</p>
          <button onClick={() => navigate("search")} style={{
            padding:"14px 36px", borderRadius:50, border:"none", cursor:"pointer",
            background:"var(--accent)", color:"white", fontSize:15, fontWeight:600,
            fontFamily:"var(--sans)", position:"relative",
          }}>Start Exploring</button>
        </div>
      </section>
    </div>
  );
}

// ─── SEARCH RESULTS PAGE ─────────────────────────────────────
function SearchPage({ query, navigate, savedIds, onSave, onSearch, userLocation, userCity }) {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("grid");
  const [activeVibes, setActiveVibes] = useState([]);
  const [activeBudget, setActiveBudget] = useState([]);
  const [activeBadges, setActiveBadges] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [aiPlaces, setAiPlaces] = useState(null);
  const [aiSummary, setAiSummary] = useState("");
  const [aiError, setAiError] = useState(false);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    setAiError(false);
    setAiPlaces(null);
    setAiSummary("");

    fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        city: userCity || "Amsterdam",
        lat: userLocation?.lat,
        lng: userLocation?.lng,
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.places && data.places.length > 0) {
          setAiPlaces(data.places);
          setAiSummary(data.intent?.summary || "");
        } else {
          setAiError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setAiError(true);
        setLoading(false);
      });
  }, [query]);

  // Fallback: filter local mock data
  const matchesQuery = (place) => {
    if (!query) return true;
    const q = query.toLowerCase().trim();
    const searchFields = [
      place.name, place.neighborhood, place.category,
      place.summary, place.bestFor,
      ...place.vibes, ...place.badges,
      ...(place.idealMoments || []),
    ].join(" ").toLowerCase();
    // Split query into words, check if ANY word (or its stem) appears
    const words = q.split(/\s+/).filter(w => w.length > 1);
    return words.some(word => {
      // Direct substring match
      if (searchFields.includes(word)) return true;
      // Try without trailing s (gyms -> gym)
      if (word.endsWith("s") && searchFields.includes(word.slice(0, -1))) return true;
      // Try without trailing es
      if (word.endsWith("es") && searchFields.includes(word.slice(0, -2))) return true;
      // Check if any search field word starts with the query word
      const fieldWords = searchFields.split(/\s+/);
      if (fieldWords.some(fw => fw.startsWith(word) || word.startsWith(fw))) return true;
      return false;
    });
  };

  const localFiltered = PLACES.filter(p => {
    if (!matchesQuery(p)) return false;
    if (activeVibes.length && !activeVibes.some(v => p.vibes.includes(v))) return false;
    if (activeBudget.length && !activeBudget.includes(p.price)) return false;
    if (activeBadges.length && !activeBadges.some(b => p.badges.includes(b))) return false;
    return true;
  });

  // Use AI results if available, otherwise fallback to local
  const displayPlaces = aiPlaces && !aiError ? aiPlaces : localFiltered;
  const filtered = displayPlaces.filter(p => {
    if (activeVibes.length && !activeVibes.some(v => (p.vibes || []).includes(v))) return false;
    if (activeBudget.length && !activeBudget.includes(p.price)) return false;
    if (activeBadges.length && !activeBadges.some(b => (p.badges || []).includes(b))) return false;
    return true;
  });

  return (
    <div style={{ paddingTop:90, minHeight:"100vh" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
        {/* Search bar */}
        <div style={{ maxWidth:700, margin:"0 auto 28px" }}>
          <SearchBar onSearch={onSearch} initialValue={query} autoFocus={!query} />
        </div>

        {query && !loading && (
          <div className="fade-up" style={{ textAlign:"center", marginBottom:32 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:"var(--radius-md)", background:"var(--accent-bg)", marginBottom:12 }}>
              <Icons.Sparkle />
              <span style={{ fontSize:14, color:"var(--accent)", fontWeight:500 }}>
                {aiPlaces && !aiError ? "AI found real places for you" : "Showing curated results"}
              </span>
            </div>
            <p style={{ fontSize:14, color:"var(--text-secondary)", maxWidth:500, margin:"0 auto" }}>
              {aiSummary || `Showing places matching: "${query}"`}
            </p>
            {userLocation && (
              <p style={{ fontSize:12, color:"var(--text-muted)", marginTop:6, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
                <Icons.Pin /> Searching near {userCity || "your location"}
              </p>
            )}
          </div>
        )}

        {/* Toolbar */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button onClick={() => setShowFilters(!showFilters)} style={{
              display:"flex", alignItems:"center", gap:6, padding:"8px 16px",
              borderRadius:50, border:"1.5px solid var(--border)", background:"var(--bg-card)",
              cursor:"pointer", fontSize:13, fontWeight:500, color:"var(--text-secondary)", fontFamily:"var(--sans)",
            }}><Icons.Filter /> Filters {(activeVibes.length+activeBudget.length+activeBadges.length) > 0 && <span style={{ width:18, height:18, borderRadius:"50%", background:"var(--accent)", color:"white", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{activeVibes.length+activeBudget.length+activeBadges.length}</span>}</button>
            <span style={{ fontSize:13, color:"var(--text-muted)" }}>{filtered.length} places</span>
          </div>
          <div style={{ display:"flex", gap:4 }}>
            {[{v:"grid",I:Icons.Grid},{v:"list",I:Icons.List},{v:"map",I:Icons.Map}].map(({v:val,I:Ic}) => (
              <button key={val} onClick={() => setView(val)} style={{
                width:36, height:36, borderRadius:"var(--radius-sm)", border:"1.5px solid var(--border)",
                background: view===val ? "var(--text)" : "var(--bg-card)",
                color: view===val ? "white" : "var(--text-muted)",
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
              }}><Ic /></button>
            ))}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="slide-down" style={{ background:"var(--bg-card)", borderRadius:"var(--radius-lg)", padding:24, marginBottom:24, boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:12, fontWeight:600, color:"var(--text-muted)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>Mood / Vibe</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {VIBE_FILTERS.map(v => <VibeTag key={v} tag={v} selected={activeVibes.includes(v)} onClick={() => setActiveVibes(a => a.includes(v) ? a.filter(x=>x!==v) : [...a,v])} small />)}
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <p style={{ fontSize:12, fontWeight:600, color:"var(--text-muted)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>Budget</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {BUDGET_FILTERS.map(v => <VibeTag key={v} tag={v} selected={activeBudget.includes(v)} onClick={() => setActiveBudget(a => a.includes(v) ? a.filter(x=>x!==v) : [...a,v])} small />)}
              </div>
            </div>
            <div>
              <p style={{ fontSize:12, fontWeight:600, color:"var(--text-muted)", letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:10 }}>Features</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {BADGE_OPTIONS.map(v => <VibeTag key={v} tag={v} selected={activeBadges.includes(v)} onClick={() => setActiveBadges(a => a.includes(v) ? a.filter(x=>x!==v) : [...a,v])} small />)}
              </div>
            </div>
            {(activeVibes.length+activeBudget.length+activeBadges.length) > 0 && (
              <button onClick={() => { setActiveVibes([]); setActiveBudget([]); setActiveBadges([]); }} style={{
                marginTop:16, fontSize:13, fontWeight:500, color:"var(--accent)", background:"none", border:"none", cursor:"pointer",
              }}>Clear all filters</button>
            )}
          </div>
        )}

        {/* Results */}
        {loading ? <LoadingSkeleton /> : view === "map" ? (
          <GoogleMap places={filtered} height={500} onMarkerClick={(p) => navigate("detail", p)} />
        ) : (
          <div style={{
            display:"grid",
            gridTemplateColumns: view === "list" ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))",
            gap: view === "list" ? 16 : 24,
          }}>
            {filtered.map((p,i) => (
              <div key={p.id} style={{ animationDelay:`${i*0.05}s` }} className="fade-up">
                <PlaceCard place={p} onSelect={() => navigate("detail", p)} onSave={onSave} saved={savedIds.has(p.id)} />
              </div>
            ))}
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <p style={{ fontSize:17, fontWeight:500, color:"var(--text-secondary)" }}>No places match your filters</p>
            <p style={{ fontSize:14, color:"var(--text-muted)", marginTop:6 }}>Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PLACE DETAIL PAGE ───────────────────────────────────────
function DetailPage({ place, navigate, savedIds, onSave }) {
  const [activeImg, setActiveImg] = useState(0);
  if (!place) return null;

  return (
    <div style={{ paddingTop:80, minHeight:"100vh" }}>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 24px" }}>
        <button onClick={() => navigate("back")} style={{
          display:"flex", alignItems:"center", gap:6, border:"none", background:"none",
          cursor:"pointer", color:"var(--text-secondary)", fontSize:14, fontWeight:500,
          fontFamily:"var(--sans)", marginBottom:20, padding:0,
        }}><Icons.Back /> Back to results</button>

        {/* Gallery */}
        <div className="fade-up" style={{ borderRadius:"var(--radius-xl)", overflow:"hidden", marginBottom:32 }}>
          <img src={place.gallery?.[activeImg] || place.image} alt={place.name}
            style={{ width:"100%", height:"clamp(280px, 50vw, 460px)", objectFit:"cover" }} />
          {place.gallery?.length > 1 && (
            <div style={{ display:"flex", gap:8, padding:12, background:"var(--bg-card)" }}>
              {place.gallery.map((img,i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{
                  width:64, height:48, borderRadius:"var(--radius-sm)", overflow:"hidden", cursor:"pointer",
                  opacity: activeImg === i ? 1 : 0.5, border: activeImg === i ? "2px solid var(--accent)" : "2px solid transparent",
                  transition:"all 0.2s",
                }}><img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} /></div>
              ))}
            </div>
          )}
        </div>

        {/* Header */}
        <div className="fade-up-1" style={{ marginBottom:28 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div>
              <h1 style={{ fontFamily:"var(--serif)", fontSize:"clamp(30px, 5vw, 42px)", fontWeight:600, letterSpacing:"-0.02em", marginBottom:6 }}>{place.name}</h1>
              <div style={{ display:"flex", alignItems:"center", gap:12, color:"var(--text-muted)", fontSize:14 }}>
                <span style={{ display:"flex", alignItems:"center", gap:4 }}><Icons.Pin /> {place.neighborhood}</span>
                <span>{place.category}</span>
                <span style={{ display:"flex", alignItems:"center", gap:3, color:"var(--accent)" }}><Icons.Star /> {place.rating}</span>
                <span>{place.price}</span>
              </div>
            </div>
            <button onClick={() => onSave(place.id)} style={{
              display:"flex", alignItems:"center", gap:6, padding:"10px 20px",
              borderRadius:50, border:`2px solid ${savedIds.has(place.id) ? "var(--accent)" : "var(--border)"}`,
              background: savedIds.has(place.id) ? "var(--accent-bg)" : "transparent",
              color: savedIds.has(place.id) ? "var(--accent)" : "var(--text-secondary)",
              cursor:"pointer", fontSize:14, fontWeight:600, fontFamily:"var(--sans)",
            }}><Icons.Heart filled={savedIds.has(place.id)} /> {savedIds.has(place.id) ? "Saved" : "Save"}</button>
          </div>
        </div>

        {/* Vibes */}
        <div className="fade-up-2" style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:28 }}>
          {place.vibes.map(v => <VibeTag key={v} tag={v} />)}
          {place.badges.map(b => <Badge key={b} text={b} />)}
        </div>

        {/* Description */}
        <div className="fade-up-2" style={{ marginBottom:36 }}>
          <p style={{ fontSize:16, lineHeight:1.7, color:"var(--text-secondary)" }}>{place.summary}</p>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:24, marginBottom:36 }}>
          {/* Mood Match */}
          <div className="fade-up-3" style={{ padding:28, borderRadius:"var(--radius-lg)", background:"var(--bg-card)", boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
            <h3 style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:600, marginBottom:20 }}>Mood Match</h3>
            <ScoreBar label="Calmness" value={place.scores.calm} />
            <ScoreBar label="Style" value={place.scores.style} />
            <ScoreBar label="Work-friendly" value={place.scores.work} />
            <ScoreBar label="Romance" value={place.scores.romance} />
            <ScoreBar label="Energy" value={place.scores.energy} />
            <ScoreBar label="Value" value={place.scores.value} />
            <ScoreBar label="Local vibe" value={place.scores.local} />
          </div>

          {/* Details */}
          <div className="fade-up-4" style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div style={{ padding:28, borderRadius:"var(--radius-lg)", background:"var(--bg-card)", boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
              <h3 style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:600, marginBottom:12 }}>Best for</h3>
              <p style={{ fontSize:14, lineHeight:1.6, color:"var(--text-secondary)" }}>{place.bestFor}</p>
            </div>
            <div style={{ padding:28, borderRadius:"var(--radius-lg)", background:"var(--bg-card)", boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
              <h3 style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:600, marginBottom:12 }}>Ideal moments</h3>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {place.idealMoments?.map(m => (
                  <span key={m} style={{ fontSize:13, padding:"6px 14px", borderRadius:50, background:"var(--sand-light)", color:"var(--text-secondary)", fontWeight:500 }}>{m}</span>
                ))}
              </div>
            </div>
            <div style={{ padding:28, borderRadius:"var(--radius-lg)", background:"var(--bg-card)", boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
              <h3 style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:600, marginBottom:12 }}>Hours</h3>
              <div style={{ display:"flex", alignItems:"center", gap:6, color:"var(--text-secondary)", fontSize:14 }}>
                <Icons.Clock /> {place.hours}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="fade-up-5" style={{ marginBottom:36 }}>
          <GoogleMap singlePlace={place} height={280} />
        </div>

        {/* Similar places */}
        <div style={{ marginBottom:40 }}>
          <h3 style={{ fontFamily:"var(--serif)", fontSize:24, fontWeight:600, marginBottom:20, letterSpacing:"-0.01em" }}>Similar places</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:20 }}>
            {PLACES.filter(p => p.id !== place.id).slice(0,3).map(p => (
              <PlaceCard key={p.id} place={p} onSelect={() => navigate("detail", p)} onSave={onSave} saved={savedIds.has(p.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FAVORITES PAGE ──────────────────────────────────────────
function FavoritesPage({ savedIds, onSave, navigate, places }) {
  const [activeList, setActiveList] = useState("all");
  const [lists] = useState(["all","Date night","Work spots","Weekend ideas","Hidden gems"]);
  const savedPlaces = places.filter(p => savedIds.has(p.id));

  return (
    <div style={{ paddingTop:100, minHeight:"100vh" }}>
      <div style={{ maxWidth:1000, margin:"0 auto", padding:"0 24px" }}>
        <div className="fade-up" style={{ marginBottom:32 }}>
          <h1 style={{ fontFamily:"var(--serif)", fontSize:"clamp(30px, 5vw, 42px)", fontWeight:600, letterSpacing:"-0.02em", marginBottom:8 }}>Saved Places</h1>
          <p style={{ fontSize:15, color:"var(--text-secondary)" }}>Your personal collection of favorite spots</p>
        </div>

        <div className="fade-up-1" style={{ display:"flex", gap:8, marginBottom:32, flexWrap:"wrap" }}>
          {lists.map(l => (
            <button key={l} onClick={() => setActiveList(l)} style={{
              padding:"8px 18px", borderRadius:50, cursor:"pointer",
              border: `2px solid ${activeList === l ? "var(--accent)" : "var(--border)"}`,
              background: activeList === l ? "var(--accent-bg)" : "transparent",
              color: activeList === l ? "var(--accent)" : "var(--text-secondary)",
              fontSize:14, fontWeight:500, fontFamily:"var(--sans)", transition:"all 0.2s",
            }}>{l === "all" ? `All (${savedPlaces.length})` : l}</button>
          ))}
          <button style={{
            padding:"8px 18px", borderRadius:50, border:"2px dashed var(--border)",
            background:"transparent", cursor:"pointer", fontSize:14, fontWeight:500,
            color:"var(--text-muted)", fontFamily:"var(--sans)", display:"flex", alignItems:"center", gap:4,
          }}><Icons.Plus /> New list</button>
        </div>

        {savedPlaces.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"var(--sand-light)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", color:"var(--text-muted)" }}>
              <Icons.Heart filled={false} />
            </div>
            <p style={{ fontSize:17, fontWeight:500, color:"var(--text-secondary)", marginBottom:6 }}>No saved places yet</p>
            <p style={{ fontSize:14, color:"var(--text-muted)", marginBottom:24 }}>Start exploring and save places you love</p>
            <button onClick={() => navigate("search")} style={{
              padding:"12px 28px", borderRadius:50, border:"none", background:"var(--accent)",
              color:"white", cursor:"pointer", fontSize:14, fontWeight:600, fontFamily:"var(--sans)",
            }}>Explore Places</button>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(320px, 1fr))", gap:24 }}>
            {savedPlaces.map(p => <PlaceCard key={p.id} place={p} onSelect={() => navigate("detail", p)} onSave={onSave} saved={true} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ────────────────────────────────────────────
function ProfilePage({ savedIds, preferences }) {
  const vibePrefs = preferences?.vibes || ["cozy","calm","stylish","creative"];
  const budget = preferences?.budget || "€€ Mid-range";

  return (
    <div style={{ paddingTop:100, minHeight:"100vh" }}>
      <div style={{ maxWidth:700, margin:"0 auto", padding:"0 24px" }}>
        <div className="fade-up" style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{
            width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg, var(--accent), var(--accent-light))",
            display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px",
            color:"white", fontSize:28, fontFamily:"var(--serif)", fontWeight:600,
          }}>K</div>
          <h1 style={{ fontFamily:"var(--serif)", fontSize:28, fontWeight:600, letterSpacing:"-0.02em" }}>Your Profile</h1>
          <p style={{ fontSize:14, color:"var(--text-muted)" }}>Amsterdam · {savedIds.size} saved places</p>
        </div>

        <div className="fade-up-1" style={{ background:"var(--bg-card)", borderRadius:"var(--radius-lg)", padding:28, marginBottom:20, boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
          <h3 style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:600, marginBottom:16 }}>Vibe Preferences</h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {vibePrefs.map(v => <VibeTag key={v} tag={v} selected />)}
          </div>
        </div>

        <div className="fade-up-2" style={{ background:"var(--bg-card)", borderRadius:"var(--radius-lg)", padding:28, marginBottom:20, boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
          <h3 style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:600, marginBottom:16 }}>Preferred Budget</h3>
          <span style={{ padding:"8px 18px", borderRadius:50, background:"var(--accent-bg)", color:"var(--accent)", fontSize:14, fontWeight:600 }}>{budget}</span>
        </div>

        <div className="fade-up-3" style={{ background:"var(--bg-card)", borderRadius:"var(--radius-lg)", padding:28, marginBottom:20, boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
          <h3 style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:600, marginBottom:16 }}>Usually Searching For</h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {(preferences?.searching || ["Coffee spots","Brunch places","Hidden gems"]).map(s => (
              <span key={s} style={{ padding:"6px 14px", borderRadius:50, background:"var(--sand-light)", color:"var(--text-secondary)", fontSize:13, fontWeight:500 }}>{s}</span>
            ))}
          </div>
        </div>

        <div className="fade-up-4" style={{ background:"var(--bg-card)", borderRadius:"var(--radius-lg)", padding:28, boxShadow:"var(--shadow-sm)", border:"1px solid var(--border-light)" }}>
          <h3 style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:600, marginBottom:16 }}>Settings</h3>
          {["City: Amsterdam","Notifications","Dark mode","Language: English"].map(s => (
            <div key={s} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid var(--border-light)" }}>
              <span style={{ fontSize:14, color:"var(--text-secondary)" }}>{s}</span>
              <Icons.Arrow />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COLLECTIONS PAGE ────────────────────────────────────────
function CollectionsPage({ onSearch }) {
  return (
    <div style={{ paddingTop:100, minHeight:"100vh" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px" }}>
        <div className="fade-up" style={{ marginBottom:36 }}>
          <h1 style={{ fontFamily:"var(--serif)", fontSize:"clamp(30px, 5vw, 42px)", fontWeight:600, letterSpacing:"-0.02em", marginBottom:8 }}>Collections</h1>
          <p style={{ fontSize:15, color:"var(--text-secondary)" }}>Handpicked place collections for every mood and moment</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:20 }}>
          {COLLECTIONS.map((c,i) => (
            <div key={c.id} className="fade-up" style={{ animationDelay:`${i*0.08}s` }}>
              <CollectionCard collection={c} onClick={() => onSearch(c.title)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────
export default function VibeSpot() {
  const [page, setPage] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [savedIds, setSavedIds] = useState(new Set());
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [preferences, setPreferences] = useState(null);
  const [history, setHistory] = useState(["home"]);
  const [userLocation, setUserLocation] = useState(null);
  const [userCity, setUserCity] = useState("Amsterdam");

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          // Reverse geocode to get city name
          if (window.google?.maps?.Geocoder) {
            new window.google.maps.Geocoder().geocode({ location: loc }, (results, status) => {
              if (status === "OK" && results[0]) {
                const city = results[0].address_components.find(c => c.types.includes("locality"));
                if (city) setUserCity(city.long_name);
              }
            });
          }
        },
        () => {}, // silently fail, keep Amsterdam as default
        { timeout: 5000 }
      );
    }
  }, []);

  const navigate = useCallback((target, data) => {
    if (target === "back") {
      if (history.length > 1) {
        const prev = history[history.length - 2];
        setHistory(h => h.slice(0, -1));
        setPage(prev);
      }
      return;
    }
    if (target === "detail" && data) { setSelectedPlace(data); }
    setPage(target);
    setHistory(h => [...h, target]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [history]);

  const handleSearch = useCallback((q) => {
    setSearchQuery(q);
    navigate("search");
  }, [navigate]);

  const toggleSave = useCallback((id) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const completeOnboarding = useCallback((answers) => {
    setPreferences(answers);
    setShowOnboarding(false);
  }, []);

  return (
    <>
      <style>{globalCSS}</style>
      {showOnboarding && <OnboardingModal onComplete={completeOnboarding} />}
      <Navbar page={page} navigate={navigate} />

      <main style={{ paddingBottom: 80 }}>
        {page === "home" && <LandingPage navigate={navigate} onSearch={handleSearch} savedIds={savedIds} onSave={toggleSave} />}
        {page === "search" && <SearchPage query={searchQuery} navigate={navigate} savedIds={savedIds} onSave={toggleSave} onSearch={handleSearch} userLocation={userLocation} userCity={userCity} />}
        {page === "detail" && <DetailPage place={selectedPlace} navigate={navigate} savedIds={savedIds} onSave={toggleSave} />}
        {page === "favorites" && <FavoritesPage savedIds={savedIds} onSave={toggleSave} navigate={navigate} places={PLACES} />}
        {page === "profile" && <ProfilePage savedIds={savedIds} preferences={preferences} />}
        {page === "collections" && <CollectionsPage onSearch={handleSearch} />}
      </main>

      <Footer />
      <MobileBottomNav page={page} navigate={navigate} />
    </>
  );
}
