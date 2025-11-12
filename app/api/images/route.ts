import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import { SiteConfig } from "../../../models/SiteConfig";

export const runtime = "nodejs";

// Handle CORS preflight requests
export async function OPTIONS() {
	return new NextResponse(null, {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
	});
}

function defaults() {
	return {
		heroImageUrl: "",
		logoUrl: "https://res.cloudinary.com/dvohrn0zf/image/upload/v1762935030/s25-removebg-preview_yquban.png",
		featuredImages: [],
	};
}

export async function GET() {
	try {
		await connectToDatabase();
		let config = await SiteConfig.findOne({});
		if (!config) {
			const def = defaults();
			config = await SiteConfig.create(def);
		}
		// Validate URLs to avoid upstream 404 spam
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 2500);
		const check = async (url?: string) => {
			if (!url) return false;
			try {
				const res = await fetch(url, { method: "HEAD", cache: "no-store", signal: controller.signal as any });
				return res.ok;
			} catch {
				return false;
			}
		};
		const heroOk = await check(config.heroImageUrl);
		clearTimeout(timeout);
		const heroImageUrl = heroOk
			? config.heroImageUrl
			: "https://res.cloudinary.com/demo/image/upload/w_1600,c_fill/sample.jpg";
		return NextResponse.json(
			{ heroImageUrl, logoUrl: config.logoUrl, featuredImages: (config as any).featuredImages || [] },
			{
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
				},
			}
		);
	} catch (error: any) {
		console.error("Images API error:", error?.message || error);
		// Fallback to defaults if database connection fails
		const def = defaults();
		return NextResponse.json(def, {
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
			},
		});
	}
}

export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const { heroImageUrl, logoUrl, featuredImages } = body || {};
		if (!heroImageUrl) {
			return NextResponse.json({ error: "Pogrešni podaci." }, { status: 400 });
		}
		await connectToDatabase();
		const updateData: any = { heroImageUrl, logoUrl };
		if (Array.isArray(featuredImages)) {
			updateData.featuredImages = featuredImages.slice(0, 6); // Max 6 slika
		}
		const updated = await SiteConfig.findOneAndUpdate({}, updateData, { new: true, upsert: true });
		return NextResponse.json({
			heroImageUrl: updated.heroImageUrl,
			logoUrl: updated.logoUrl,
			featuredImages: updated.featuredImages || [],
		});
	} catch {
		return NextResponse.json({ error: "Greška na serveru." }, { status: 500 });
	}
}
