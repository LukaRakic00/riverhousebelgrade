import { NextResponse } from "next/server";
import { cloudinary } from "../../../lib/cloudinary";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

export async function POST(req: Request) {
	const cookieStore = cookies();
	const token = cookieStore.get("admin_token")?.value;
	const secret = process.env.JWT_SECRET;
	if (!token || !secret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	try { jwt.verify(token, secret); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
	try {
		const form = await req.formData();
		const file = form.get("file") as unknown as File | null;
		if (!file) {
			return NextResponse.json({ error: "Nedostaje fajl." }, { status: 400 });
		}
		const buffer = Buffer.from(await file.arrayBuffer());
		const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
		const folder = process.env.CLOUDINARY_UPLOAD_FOLDER || "river-house-belgrade";
		const res = await cloudinary.uploader.upload(base64, { folder });
		return NextResponse.json({ url: res.secure_url, publicId: res.public_id });
	} catch (e) {
		return NextResponse.json({ error: "Greška pri uploadu." }, { status: 500 });
	}
}


