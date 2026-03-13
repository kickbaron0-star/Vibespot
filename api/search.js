// /api/search.js — Vercel Serverless Function
// Takes a natural language query, uses Claude to interpret it,
// then searches Google Places API for real results,
// then uses Claude to add vibe scores and descriptions.

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { query, city = "Amsterdam" } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  const GOOGLE_KEY = process.env.GOOGLE_MAPS_KEY || process.env.VITE_GOOGLE_MAPS_KEY;

  if (!ANTHROPIC_KEY || !GOOGLE_KEY) {
    return res.status(500).json({ error: "Missing API keys" });
  }

  try {
    // Step 1: Ask Claude to interpret the query
    const intentResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: `You are a local discovery AI for ${city}. A user searched: "${query}"

Interpret their intent and return ONLY valid JSON (no markdown, no backticks):
{
  "searchTerms": ["term1", "term2", "term3"],
  "category": "restaurant|cafe|bar|gym|club|brunch|lunch|any",
  "vibeKeywords": ["cozy", "romantic", etc],
  "priceLevel": "budget|mid|premium|any",
  "summary": "One sentence explaining what you understood the user wants"
}

searchTerms should be 2-3 Google Maps search queries that would find the right places in ${city}. Be specific, e.g. "cozy coffee shop Amsterdam Jordaan" not just "coffee".`
        }],
      }),
    });

    const intentData = await intentResponse.json();
    const intentText = intentData.content?.[0]?.text || "";
    
    let intent;
    try {
      intent = JSON.parse(intentText);
    } catch {
      // Try to extract JSON from the response
      const jsonMatch = intentText.match(/\{[\s\S]*\}/);
      intent = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        searchTerms: [`${query} ${city}`],
        category: "any",
        vibeKeywords: [],
        priceLevel: "any",
        summary: `Searching for "${query}" in ${city}`,
      };
    }

    // Step 2: Search Google Places for each search term
    const allPlaces = [];
    const seenIds = new Set();

    for (const term of (intent.searchTerms || [`${query} ${city}`]).slice(0, 3)) {
      const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(term)}&key=${GOOGLE_KEY}`;
      const placesRes = await fetch(placesUrl);
      const placesData = await placesRes.json();

      for (const place of (placesData.results || []).slice(0, 5)) {
        if (seenIds.has(place.place_id)) continue;
        seenIds.add(place.place_id);

        // Get photo URL
        let photoUrl = null;
        if (place.photos?.[0]?.photo_reference) {
          photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_KEY}`;
        }

        allPlaces.push({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          lat: place.geometry?.location?.lat,
          lng: place.geometry?.location?.lng,
          rating: place.rating || 0,
          userRatingsTotal: place.user_ratings_total || 0,
          priceLevel: place.price_level,
          image: photoUrl,
          openNow: place.opening_hours?.open_now,
          types: place.types || [],
        });
      }
    }

    // Limit to top 12
    const topPlaces = allPlaces.slice(0, 12);

    if (topPlaces.length === 0) {
      return res.status(200).json({
        intent,
        places: [],
        message: "No places found for your search",
      });
    }

    // Step 3: Ask Claude to enrich places with vibe scores
    const enrichResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        messages: [{
          role: "user",
          content: `You are a local discovery AI. The user searched: "${query}"
You understood: ${intent.summary}

Here are real places found in ${city}:
${topPlaces.map((p, i) => `${i + 1}. ${p.name} - ${p.address} (rating: ${p.rating}, types: ${p.types.join(", ")})`).join("\n")}

For each place, return ONLY a valid JSON array (no markdown, no backticks). Each item should have:
{
  "index": 0,
  "summary": "2-sentence atmospheric description making it sound appealing",
  "vibes": ["3 vibe tags from: cozy, calm, stylish, productive, lively, romantic, hidden gem, luxury, local, casual, sunny, intimate, social, aesthetic, creative"],
  "badges": ["2-3 badges from: laptop-friendly, great coffee, terrace, hidden gem, date-worthy, quiet, stylish interior, local favorite, luxury feel, lively, casual, great cocktails, live music, good for groups"],
  "bestFor": "Who this place is best for in one short phrase",
  "price": "€ or €€ or €€€",
  "scores": { "calm": 0-100, "style": 0-100, "work": 0-100, "romance": 0-100, "energy": 0-100, "value": 0-100, "local": 0-100 },
  "category": "most fitting category like Coffee, Restaurant, Brunch, Bar, Gym, Club, Lunch"
}

Base your assessment on the place name, type, location, and rating. Be creative but realistic.`
        }],
      }),
    });

    const enrichData = await enrichResponse.json();
    const enrichText = enrichData.content?.[0]?.text || "[]";

    let enrichments;
    try {
      enrichments = JSON.parse(enrichText);
    } catch {
      const jsonMatch = enrichText.match(/\[[\s\S]*\]/);
      enrichments = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    }

    // Step 4: Merge enrichments with places
    const enrichedPlaces = topPlaces.map((place, i) => {
      const enrichment = enrichments[i] || enrichments.find(e => e.index === i) || {};
      return {
        ...place,
        summary: enrichment.summary || `A popular spot in ${city}`,
        vibes: enrichment.vibes || intent.vibeKeywords || ["local"],
        badges: enrichment.badges || [],
        bestFor: enrichment.bestFor || "Visitors and locals",
        price: enrichment.price || "€€",
        scores: enrichment.scores || { calm: 50, style: 50, work: 50, romance: 50, energy: 50, value: 50, local: 50 },
        category: enrichment.category || "Restaurant",
        neighborhood: place.address?.split(",")[1]?.trim() || city,
        hours: place.openNow !== undefined ? (place.openNow ? "Open now" : "Closed") : "Check online",
        idealMoments: [],
        gallery: place.image ? [place.image] : [],
      };
    });

    return res.status(200).json({
      intent,
      places: enrichedPlaces,
    });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Search failed", details: error.message });
  }
}
