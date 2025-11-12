import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Google Places API endpoint za dobijanje recenzija
// Napomena: Za produkciju, treba koristiti Google Places API sa API ključem
// Ovo je placeholder koji simulira strukturu recenzija

export async function GET() {
	try {
		const placeId = process.env.GOOGLE_PLACE_ID;
		const apiKey = process.env.GOOGLE_PLACES_API_KEY;

		// Ako su API ključ i Place ID postavljeni, koristi Google Places API
		if (placeId && apiKey) {
			try {
				const response = await fetch(
					`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`,
					{ next: { revalidate: 3600 } } // Cache za 1 sat
				);
				
				if (!response.ok) {
					throw new Error(`Google Places API error: ${response.status}`);
				}

				const data = await response.json();
				
				if (data.status === "OK" && data.result?.reviews) {
					// Transformiši Google recenzije u naš format
					const reviews = data.result.reviews.map((review: any) => ({
						author_name: review.author_name,
						rating: review.rating,
						text: review.text,
						time: review.time * 1000, // Google koristi sekunde, mi koristimo milisekunde
						relative_time_description: review.relative_time_description,
					}));
					
					return NextResponse.json(reviews);
				} else if (data.status === "REQUEST_DENIED") {
					console.error("Google Places API: Request denied. Check API key and billing.");
				} else {
					console.error("Google Places API error:", data.status, data.error_message);
				}
			} catch (apiError: any) {
				console.error("Google Places API fetch error:", apiError?.message);
				// Fallback na mock podatke ako API ne radi
			}
		}

		// Fallback: vraćamo mock podatke ako API nije podešen ili ne radi
		const mockReviews = [
			{
				author_name: "Marko Petrović",
				rating: 5,
				text: "Odličan smeštaj! Prelepa lokacija na vodi, čisto i uredno. Preporučujem svima!",
				time: Date.now() - 86400000, // 1 dan pre
			},
			{
				author_name: "Ana Jovanović",
				rating: 5,
				text: "Savršeno mesto za opuštanje. Terasa na vodi je neverovatna, a domaćini su vrlo ljubazni.",
				time: Date.now() - 172800000, // 2 dana pre
			},
			{
				author_name: "Stefan Nikolić",
				rating: 5,
				text: "Najbolji vikend ikada! Moderna kuhinja, brz WiFi, sve je bilo savršeno. Definitivno ćemo se vratiti.",
				time: Date.now() - 259200000, // 3 dana pre
			},
		];

		return NextResponse.json(mockReviews);
	} catch (error: any) {
		console.error("Google Reviews API error:", error?.message || error);
		return NextResponse.json(
			{ error: "Greška pri učitavanju recenzija" },
			{ status: 500 }
		);
	}
}

