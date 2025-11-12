import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { fullName, email, phone, message } = body || {};

		if (!fullName || !email) {
			return NextResponse.json({ error: "Nedostaju potrebna polja." }, { status: 400 });
		}

		const adminEmail = process.env.ADMIN_EMAIL || "info@riverhouse.rs";

		// Email za admina (ti dobijaš obaveštenje)
		await resend.emails.send({
			from: "River House Belgrade <noreply@riverhouse.rs>",
			to: adminEmail,
			subject: `Nova rezervacija - ${fullName}`,
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
						.container { max-width: 600px; margin: 0 auto; padding: 20px; }
						.header { background: #000; color: #fff; padding: 30px; text-align: center; }
						.content { background: #f9f9f9; padding: 30px; }
						.field { margin-bottom: 20px; }
						.label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
						.value { font-size: 16px; color: #000; margin-top: 5px; }
						.message-box { background: #fff; border-left: 4px solid #000; padding: 15px; margin-top: 10px; }
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
							<h1 style="margin: 0;">River House Belgrade</h1>
							<p style="margin: 10px 0 0 0; opacity: 0.9;">Nova rezervacija</p>
						</div>
						<div class="content">
							<div class="field">
								<div class="label">Ime i prezime</div>
								<div class="value">${fullName}</div>
							</div>
							<div class="field">
								<div class="label">Email</div>
								<div class="value">${email}</div>
							</div>
							${phone ? `
							<div class="field">
								<div class="label">Telefon</div>
								<div class="value">${phone}</div>
							</div>
							` : ""}
							${message ? `
							<div class="field">
								<div class="label">Poruka</div>
								<div class="message-box">${message.replace(/\n/g, "<br>")}</div>
							</div>
							` : ""}
						</div>
					</div>
				</body>
				</html>
			`,
		});

		// Email za korisnika (potvrda)
		await resend.emails.send({
			from: "River House Belgrade <noreply@riverhouse.rs>",
			to: email,
			subject: "Hvala na interesovanju - River House Belgrade",
			html: `
				<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<style>
						body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
						.container { max-width: 600px; margin: 0 auto; padding: 20px; }
						.header { background: #000; color: #fff; padding: 30px; text-align: center; }
						.content { background: #f9f9f9; padding: 30px; }
						.footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
					</style>
				</head>
				<body>
					<div class="container">
						<div class="header">
							<h1 style="margin: 0;">River House Belgrade</h1>
							<p style="margin: 10px 0 0 0; opacity: 0.9;">Raj na vodi</p>
						</div>
						<div class="content">
							<p>Poštovani/na <strong>${fullName}</strong>,</p>
							<p>Hvala vam što ste se zainteresovali za River House Belgrade!</p>
							<p>Primili smo vašu poruku i javićemo vam se u najkraćem roku sa detaljima o dostupnosti i rezervaciji.</p>
							<p>U međuvremenu, možete pogledati našu <a href="https://riverhouse.rs/#galerija" style="color: #000; text-decoration: underline;">galeriju</a> ili nas kontaktirati direktno.</p>
							<p>Srdačan pozdrav,<br><strong>River House Belgrade</strong></p>
						</div>
						<div class="footer">
							<p>© ${new Date().getFullYear()} River House Belgrade. Sva prava zadržana.</p>
						</div>
					</div>
				</body>
				</html>
			`,
		});

		return NextResponse.json({ ok: true });
	} catch (error: any) {
		console.error("Email error:", error);
		return NextResponse.json({ error: "Greška pri slanju emaila." }, { status: 500 });
	}
}

