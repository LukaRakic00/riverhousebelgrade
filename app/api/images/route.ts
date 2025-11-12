import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/db";
import { SiteConfig } from "../../../models/SiteConfig";

export const runtime = "nodejs";

function defaults() {
	return {
		heroImageUrl: "",
		logoUrl: "https://res.cloudinary.com/dvohrn0zf/image/upload/v1762935030/s25-removebg-preview_yquban.png",
		galleryImageUrls: [],
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
		const validatedGallery = await Promise.all(
			(config.galleryImageUrls || []).map(async (u: string) => (await check(u)) ? u : null)
		);
		clearTimeout(timeout);
		const galleryImageUrls = validatedGallery.filter(Boolean) as string[];
		const heroImageUrl = heroOk
			? config.heroImageUrl
			: "https://res.cloudinary.com/demo/image/upload/w_1600,c_fill/sample.jpg";
		return NextResponse.json({ heroImageUrl, logoUrl: config.logoUrl, galleryImageUrls });
	} catch {
		const def = defaults();
		return NextResponse.json(def);
	}
}

export async function PUT(req: Request) {
	try {
		const body = await req.json();
		const { heroImageUrl, logoUrl, galleryImageUrls } = body || {};
		if (!heroImageUrl || !Array.isArray(galleryImageUrls)) {
			return NextResponse.json({ error: "Pogrešni podaci." }, { status: 400 });
		}
		await connectToDatabase();
		const updated = await SiteConfig.findOneAndUpdate(
			{},
			{ heroImageUrl, logoUrl, galleryImageUrls },
			{ new: true, upsert: true }
		);
		return NextResponse.json({
			heroImageUrl: updated.heroImageUrl,
			logoUrl: updated.logoUrl,
			galleryImageUrls: updated.galleryImageUrls,
		});
	} catch {
		return NextResponse.json({ error: "Greška na serveru." }, { status: 500 });
	}
}
