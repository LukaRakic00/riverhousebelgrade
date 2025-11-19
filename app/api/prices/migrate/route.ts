import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import { Price } from "../../../../models/Price";
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

// POST - Migriraj stare podatke u novu strukturu
export async function POST(req: Request) {
	if (!isAuthenticated()) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		await connectToDatabase();
		const prices = await Price.find({});
		
		for (const price of prices) {
			// Ako već ima includedItemsDetails, preskoči
			if (price.includedItemsDetails && price.includedItemsDetails.length > 0) {
				continue;
			}

			// Parsiraj stare podatke iz includedItems ili description
			const oldItems = price.includedItems || [];
			const newItemsDetails: Array<{ icon: string; title: string; description?: string }> = [];

			// Mapiranje starih stavki na nove sa emoji ikonama
			const itemMapping: Record<string, { icon: string; description?: string }> = {
				"Jacuzzi": { icon: "🛁", description: "Za potpuno opuštanje i intiman wellness doživljaj." },
				"Sauna": { icon: "🔥", description: "Sauna najvišeg kvaliteta, idealna za relaksaciju i detoks." },
				"Sezonski bazen": { icon: "🏊", description: "Privatni sezonski bazen — savršen za uživanje tokom toplih dana." },
				"Opremljen prostor": { icon: "🏡", description: "Moderan enterijer, potpuna privatnost i maksimalan komfor." },
				"Wi-Fi": { icon: "⚡" },
				"Privatnost": { icon: "🔒" },
			};

			oldItems.forEach((item: string) => {
				const trimmed = item.trim();
				if (trimmed) {
					const mapping = itemMapping[trimmed] || { icon: "✓" };
					newItemsDetails.push({
						icon: mapping.icon,
						title: trimmed,
						description: mapping.description,
					});
				}
			});

			// Ažuriraj cenu sa novom strukturom
			await Price.findByIdAndUpdate(price._id, {
				includedItemsDetails: newItemsDetails,
				additionalBenefits: "Wi-Fi • Peškiri • Higijenski set • Parking",
			}, { new: true });
		}

		return NextResponse.json({ success: true, message: "Migracija završena" });
	} catch (error: any) {
		console.error("Migration error:", error);
		return NextResponse.json({ error: error?.message || "Greška pri migraciji." }, { status: 500 });
	}
}

