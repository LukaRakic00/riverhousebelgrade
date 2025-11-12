import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import { Review } from "../../../models/Review";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
	return NextResponse.json({ error: message }, { status });
}

async function verifyAdmin(req: Request) {
	const cookieStore = cookies();
	const token = cookieStore.get("admin_token")?.value;
	const secret = process.env.JWT_SECRET;
	if (!token || !secret) return false;
	try {
		jwt.verify(token, secret);
		return true;
	} catch {
		return false;
	}
}

// Handle CORS preflight requests
export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
}

// GET - Vrati sve odobrene recenzije (ili sve ako je admin)
export async function GET(req: Request) {
	try {
		await connectToDatabase();
		const { searchParams } = new URL(req.url);
		const featured = searchParams.get("featured");
		const isAdmin = await verifyAdmin(req);

		let query: any = {};
		if (!isAdmin) {
			query.approved = true; // Samo odobrene recenzije za javnost
		}
		if (featured === "true") {
			query.featured = true;
		}

		const reviews = await Review.find(query)
			.sort({ order: 1, createdAt: -1 })
			.limit(featured === "true" ? 6 : 100);

		return NextResponse.json(reviews);
	} catch (e: any) {
		return jsonError(e?.message || "Greška pri učitavanju recenzija", 500);
	}
}

// POST - Kreiraj novu recenziju (javno dostupno)
export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { authorName, rating, text, imageUrl } = body;

		if (!authorName || !rating || !text) {
			return jsonError("Nedostaju obavezni podaci (authorName, rating, text)", 400);
		}

		if (rating < 1 || rating > 5) {
			return jsonError("Rating mora biti između 1 i 5", 400);
		}

		await connectToDatabase();
		// Nove recenzije se automatski odobravaju (možete promeniti u false za moderaciju)
		const newReview = await Review.create({
			authorName,
			rating,
			text,
			imageUrl,
			featured: false,
			order: 0,
			approved: true, // Možete promeniti u false ako želite moderaciju
		});

		return NextResponse.json(newReview, { status: 201 });
	} catch (e: any) {
		return jsonError(e?.message || "Greška pri kreiranju recenzije", 500);
	}
}

// PUT - Ažuriraj recenziju
export async function PUT(req: Request) {
	if (!(await verifyAdmin(req))) return jsonError("Unauthorized", 401);
	try {
		const body = await req.json();
		const { id, authorName, rating, text, imageUrl, featured, order, approved } = body;

		if (!id) return jsonError("Nedostaje ID recenzije", 400);
		if (rating && (rating < 1 || rating > 5)) {
			return jsonError("Rating mora biti između 1 i 5", 400);
		}

		await connectToDatabase();
		const updateData: any = {};
		if (authorName !== undefined) updateData.authorName = authorName;
		if (rating !== undefined) updateData.rating = rating;
		if (text !== undefined) updateData.text = text;
		if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
		if (featured !== undefined) updateData.featured = featured;
		if (order !== undefined) updateData.order = order;
		if (approved !== undefined) updateData.approved = approved;

		const updatedReview = await Review.findByIdAndUpdate(id, updateData, { new: true });
		if (!updatedReview) return jsonError("Recenzija nije pronađena", 404);

		return NextResponse.json(updatedReview);
	} catch (e: any) {
		return jsonError(e?.message || "Greška pri ažuriranju recenzije", 500);
	}
}

// DELETE - Obriši recenziju
export async function DELETE(req: Request) {
	if (!(await verifyAdmin(req))) return jsonError("Unauthorized", 401);
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");
		if (!id) return jsonError("Nedostaje ID recenzije", 400);

		await connectToDatabase();
		const deletedReview = await Review.findByIdAndDelete(id);
		if (!deletedReview) return jsonError("Recenzija nije pronađena", 404);

		return NextResponse.json({ message: "Recenzija obrisana" });
	} catch (e: any) {
		return jsonError(e?.message || "Greška pri brisanju recenzije", 500);
	}
}

