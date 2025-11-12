import { NextResponse } from "next/server";
import { cloudinary } from "../../../../lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: Request) {
	try {
		const form = await req.formData();
		const file = form.get("file") as unknown as File | null;
		if (!file) {
			return NextResponse.json({ error: "Nedostaje fajl." }, { status: 400 });
		}

		// Provera tipa fajla
		if (!file.type.startsWith("image/")) {
			return NextResponse.json({ error: "Fajl mora biti slika." }, { status: 400 });
		}

		// Provera veličine (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return NextResponse.json({ error: "Slika mora biti manja od 5MB." }, { status: 400 });
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
		const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "river-house-belgrade/reviews";
		
		const res = await cloudinary.uploader.upload(base64, { 
			folder,
			resource_type: "image",
		});
		
		return NextResponse.json({ url: res.secure_url, publicId: res.public_id });
	} catch (e: any) {
		console.error("Upload error:", e);
		return NextResponse.json({ error: e?.message || "Greška pri uploadu." }, { status: 500 });
	}
}

