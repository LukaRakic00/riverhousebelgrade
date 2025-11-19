import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import { Price } from "../../../models/Price";
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

// GET - Vrati cenu (javno) - vraća prvu cenu jer imamo samo jednu
// Automatski parsira stare podatke ako postoje
export async function GET() {
	try {
		await connectToDatabase();
		const price = await Price.findOne({}).sort({ createdAt: -1 });
		
		if (!price) {
			return NextResponse.json(null);
		}

		// Ako ima stare podatke u includedItems ali nema includedItemsDetails, parsiraj ih
		if (price.includedItems && price.includedItems.length > 0 && (!price.includedItemsDetails || price.includedItemsDetails.length === 0)) {
			const itemMapping: Record<string, { icon: string; description?: string }> = {
				"Jacuzzi": { icon: "🛁", description: "Za potpuno opuštanje i intiman wellness doživljaj." },
				"Sauna": { icon: "🔥", description: "Sauna najvišeg kvaliteta, idealna za relaksaciju i detoks." },
				"Sezonski bazen": { icon: "🏊", description: "Privatni sezonski bazen — savršen za uživanje tokom toplih dana." },
				"Opremljen prostor": { icon: "🏡", description: "Moderan enterijer, potpuna privatnost i maksimalan komfor." },
				"Wi-Fi": { icon: "⚡" },
				"Privatnost": { icon: "🔒" },
			};

			const newItemsDetails = price.includedItems.map((item: string) => {
				const trimmed = item.trim();
				const mapping = itemMapping[trimmed] || { icon: "✓" };
				return {
					icon: mapping.icon,
					title: trimmed,
					description: mapping.description,
				};
			});

			// Ažuriraj u bazi
			price.includedItemsDetails = newItemsDetails;
			if (!price.additionalBenefits) {
				price.additionalBenefits = "Wi-Fi • Peškiri • Higijenski set • Parking";
			}
			await price.save();
		}

		return NextResponse.json(price);
	} catch (error: any) {
		console.error("Prices GET error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri učitavanju cene." }, { status: 500 });
	}
}

// POST - Kreiraj novu cenu (samo admin)
export async function POST(req: Request) {
	if (!isAuthenticated()) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const body = await req.json();
		const { price, description, includedItems, includedItemsDetails, additionalBenefits, note } = body;
		if (price === undefined) {
			return NextResponse.json({ error: "Cena je obavezna." }, { status: 400 });
		}
		await connectToDatabase();
		// Obriši sve postojeće cene jer imamo samo jednu
		await Price.deleteMany({});
		const priceDoc = await Price.create({
			price: Number(price),
			description: description || "",
			includedItems: Array.isArray(includedItems) ? includedItems : [],
			includedItemsDetails: Array.isArray(includedItemsDetails) ? includedItemsDetails : [],
			additionalBenefits: additionalBenefits || "",
			note: note || "",
		});
		return NextResponse.json(priceDoc);
	} catch (error: any) {
		console.error("Prices POST error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri kreiranju cene." }, { status: 500 });
	}
}

// PUT - Ažuriraj cenu (samo admin)
export async function PUT(req: Request) {
	if (!isAuthenticated()) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const body = await req.json();
		const { id, price, description, includedItems, includedItemsDetails, additionalBenefits, note } = body;
		if (!id) {
			return NextResponse.json({ error: "ID cene je obavezan." }, { status: 400 });
		}
		await connectToDatabase();
		const priceDoc = await Price.findByIdAndUpdate(
			id,
			{
				price: price !== undefined ? Number(price) : undefined,
				description,
				includedItems: Array.isArray(includedItems) ? includedItems : [],
				includedItemsDetails: Array.isArray(includedItemsDetails) ? includedItemsDetails : [],
				additionalBenefits,
				note,
			},
			{ new: true }
		);
		if (!priceDoc) {
			return NextResponse.json({ error: "Cena nije pronađena." }, { status: 404 });
		}
		return NextResponse.json(priceDoc);
	} catch (error: any) {
		console.error("Prices PUT error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri ažuriranju cene." }, { status: 500 });
	}
}

// DELETE - Obriši cenu (samo admin)
export async function DELETE(req: Request) {
	if (!isAuthenticated()) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const { searchParams } = new URL(req.url);
		const id = searchParams.get("id");
		if (!id) {
			return NextResponse.json({ error: "ID cene je obavezan." }, { status: 400 });
		}
		await connectToDatabase();
		await Price.findByIdAndDelete(id);
		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error("Prices DELETE error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri brisanju cene." }, { status: 500 });
	}
}

