import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import { Category } from "../../../models/Category";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

function isAuthenticated() {
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

// GET - Vrati sve kategorije (javno)
export async function GET() {
	try {
		await connectToDatabase();
		const categories = await Category.find({}).sort({ order: 1, createdAt: -1 });
		return NextResponse.json(categories);
	} catch (error: any) {
		console.error("Categories GET error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri učitavanju kategorija." }, { status: 500 });
	}
}

// POST - Kreiraj novu kategoriju (samo admin)
export async function POST(req: Request) {
	if (!isAuthenticated()) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const body = await req.json();
		const { name, description, imageUrls, order } = body;
		if (!name) {
			return NextResponse.json({ error: "Naziv kategorije je obavezan." }, { status: 400 });
		}
		await connectToDatabase();
		const category = await Category.create({
			name,
			description: description || "",
			imageUrls: imageUrls || [],
			order: order || 0,
		});
		return NextResponse.json(category);
	} catch (error: any) {
		console.error("Categories POST error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri kreiranju kategorije." }, { status: 500 });
	}
}

// PUT - Ažuriraj kategoriju (samo admin)
export async function PUT(req: Request) {
	if (!isAuthenticated()) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const body = await req.json();
		const { id, name, description, imageUrls, order } = body;
		if (!id) {
			return NextResponse.json({ error: "ID kategorije je obavezan." }, { status: 400 });
		}
		await connectToDatabase();
		const category = await Category.findByIdAndUpdate(
			id,
			{
				name,
				description,
				imageUrls,
				order,
			},
			{ new: true }
		);
		if (!category) {
			return NextResponse.json({ error: "Kategorija nije pronađena." }, { status: 404 });
		}
		return NextResponse.json(category);
	} catch (error: any) {
		console.error("Categories PUT error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri ažuriranju kategorije." }, { status: 500 });
	}
}

// DELETE - Obriši kategoriju (samo admin)
export async function DELETE(req: Request) {
	if (!isAuthenticated()) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");
		if (!id) {
			return NextResponse.json({ error: "ID kategorije je obavezan." }, { status: 400 });
		}
		await connectToDatabase();
		await Category.findByIdAndDelete(id);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("Categories DELETE error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri brisanju kategorije." }, { status: 500 });
	}
}

