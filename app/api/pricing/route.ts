import { NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

const PRICING_FILE = join(process.cwd(), "data", "pricing.json");

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

// GET - Vrati cenu (javno)
export async function GET() {
	try {
		const data = readFileSync(PRICING_FILE, "utf-8");
		const pricing = JSON.parse(data);
		return NextResponse.json(pricing);
	} catch (error: any) {
		console.error("Pricing GET error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri učitavanju cene." }, { status: 500 });
	}
}

// PUT - Ažuriraj cenu (samo admin)
export async function PUT(req: Request) {
	if (!isAuthenticated()) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const body = await req.json();
		const { price, description, includedItemsDetails, additionalBenefits, note } = body;

		if (price === undefined) {
			return NextResponse.json({ error: "Cena je obavezna." }, { status: 400 });
		}

		const pricingData = {
			price: Number(price),
			description: description || "",
			includedItemsDetails: Array.isArray(includedItemsDetails) ? includedItemsDetails : [],
			additionalBenefits: additionalBenefits || "",
			note: note || "",
		};

		writeFileSync(PRICING_FILE, JSON.stringify(pricingData, null, 2), "utf-8");

		return NextResponse.json(pricingData);
	} catch (error: any) {
		console.error("Pricing PUT error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri ažuriranju cene." }, { status: 500 });
	}
}

