import { NextResponse } from "next/server";
import { cloudinary } from "../../../../lib/cloudinary";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
	return NextResponse.json({ error: message }, { status });
}

async function verifyAdmin() {
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

// Ekstraktuje public_id iz Cloudinary URL-a
function extractPublicId(url: string): string | null {
	try {
		// Format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
		// Ili: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
		const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.(?:jpg|jpeg|png|gif|webp|svg))?$/);
		if (match && match[1]) {
			return match[1];
		}
		// Alternativno, ako je direktan public_id
		return url;
	} catch {
		return null;
	}
}

export async function DELETE(req: Request) {
	if (!(await verifyAdmin())) {
		return jsonError("Unauthorized", 401);
	}

	try {
		const { searchParams } = new URL(req.url);
		const url = searchParams.get("url");
		const publicId = searchParams.get("publicId");

		if (!url && !publicId) {
			return jsonError("Nedostaje URL ili publicId slike", 400);
		}

		const idToDelete = publicId || extractPublicId(url!);
		if (!idToDelete) {
			return jsonError("Ne mogu da ekstraktujem public_id iz URL-a", 400);
		}

		// Brisanje iz Cloudinary-a
		const result = await cloudinary.uploader.destroy(idToDelete, {
			invalidate: true, // Invalidira cache
		});

		if (result.result === "ok" || result.result === "not found") {
			return NextResponse.json({ 
				success: true, 
				message: result.result === "ok" ? "Slika je obrisana" : "Slika nije pronađena (već obrisana)",
				publicId: idToDelete 
			});
		} else {
			return jsonError(`Greška pri brisanju: ${result.result}`, 500);
		}
	} catch (e: any) {
		console.error("Delete error:", e);
		return jsonError(e?.message || "Greška pri brisanju slike", 500);
	}
}

