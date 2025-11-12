import { NextResponse } from "next/server";
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

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const folder = searchParams.get("folder") || process.env.CLOUDINARY_UPLOAD_FOLDER || "river-house-belgrade";
		const max = Number(searchParams.get("max")) || 200;

		configureCloudinaryFromEnv();

		let nextCursor: string | undefined;
		const urls: string[] = [];
		do {
			const res: any = await cloudinary.search
				.expression(`folder=${folder}`)
				.max_results(Math.min(max, 200))
				.next_cursor(nextCursor)
				.sort_by("public_id", "asc")
				.execute();

			for (const r of res.resources || []) {
				if (r.secure_url) urls.push(r.secure_url as string);
			}
			nextCursor = res.next_cursor;
			if (urls.length >= max) break;
		} while (nextCursor);

		return NextResponse.json({ folder, count: urls.length, urls });
	} catch (e: any) {
		return NextResponse.json({ error: e?.message || "Greska pri listanju Cloudinary foldera" }, { status: 500 });
	}
}

