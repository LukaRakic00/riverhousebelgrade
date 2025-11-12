import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../../lib/db";
import { AdminUser } from "../../../../models/AdminUser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

function jsonError(message: string, status = 400) {
	return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
	try {
		const { username, password } = await req.json();
		if (!username || !password) return jsonError("Nedostaju kredencijali.", 400);
		const secret = process.env.JWT_SECRET;
		if (!secret) return jsonError("JWT_SECRET nije podešen.", 500);
		await connectToDatabase();

		// Ako nema korisnika, a postoje default varijable, kreiraj prvog admina
		let user = await AdminUser.findOne({ username });
		if (!user) {
			const defUser = process.env.ADMIN_DEFAULT_USER;
			const defPass = process.env.ADMIN_DEFAULT_PASS;
			if (defUser && defPass && username === defUser) {
				const hash = await bcrypt.hash(defPass, 10);
				user = await AdminUser.create({ username: defUser, passwordHash: hash });
			}
		}
		if (!user) return jsonError("Pogrešno korisničko ime ili lozinka.", 401);
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return jsonError("Pogrešno korisničko ime ili lozinka.", 401);

		const token = jwt.sign({ sub: user._id.toString(), username: user.username }, secret, { expiresIn: "7d" });
		const res = NextResponse.json({ ok: true });
		res.cookies.set("admin_token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7
		});
		return res;
	} catch (error: any) {
		console.error("Login error:", error);
		return jsonError(error?.message || "Greška na serveru.", 500);
	}
}


