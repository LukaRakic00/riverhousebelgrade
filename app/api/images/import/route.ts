import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import { SiteConfig } from "../../../../models/SiteConfig";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

function configureCloudinaryFromEnv() {
	const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
	const apiKey = process.env.CLOUDINARY_API_KEY;
	const apiSecret = process.env.CLOUDINARY_API_SECRET;
	if (!cloudName || !apiKey || !apiSecret) {
		throw new Error("Cloudinary kredencijali nisu podeseni u .env");
	}
	cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

async function listAllUrlsInFolder(folder: string): Promise<string[]> {
	const urls: string[] = [];
	let nextCursor: string | undefined;
	do {
		// Koristimo Cloudinary Search jer lepo filtrira po folderu
		// https://cloudinary.com/documentation/search_api
		const res: any = await cloudinary.search
			.expression(`folder=${folder}`)
			.max_results(200)
			.next_cursor(nextCursor)
			.sort_by("public_id", "asc")
			.execute();

		for (const r of res.resources || []) {
			// secure_url je pun, bez dodatnih transformacija
			if (r.secure_url) urls.push(r.secure_url as string);
		}
		nextCursor = res.next_cursor;
	} while (nextCursor);
	return urls;
}

export async function POST(req: Request) {
	try {
		const body = await req.json().catch(() => ({}));
		const folder = (body?.folder as string) || process.env.CLOUDINARY_UPLOAD_FOLDER || "river-house-belgrade";
		const heroImageUrl = body?.heroImageUrl as string | undefined;
		const logoUrl = body?.logoUrl as string | undefined;

		configureCloudinaryFromEnv();
		const urls = await listAllUrlsInFolder(folder);
		if (!urls.length) {
			return NextResponse.json({ error: `U folderu '${folder}' nema slika.` }, { status: 404 });
		}

		await connectToDatabase();
		const existing = await SiteConfig.findOne({});

		const hero = heroImageUrl || existing?.heroImageUrl || urls[0];
		const logo = logoUrl || existing?.logoUrl;

		const updated = await SiteConfig.findOneAndUpdate(
			{},
			{ heroImageUrl: hero, logoUrl: logo, galleryImageUrls: urls },
			{ new: true, upsert: true }
		);

		return NextResponse.json({
			heroImageUrl: updated.heroImageUrl,
			logoUrl: updated.logoUrl,
			galleryImageUrls: updated.galleryImageUrls,
			count: updated.galleryImageUrls.length,
			folder,
		});
	} catch (e: any) {
		return NextResponse.json({ error: e?.message || "Greska pri importu" }, { status: 500 });
	}
}

