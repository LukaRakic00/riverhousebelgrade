"use client";

import { useState } from "react";

type FormState = {
	fullName: string;
	email: string;
	phone?: string;
	message?: string;
};

export function RegistrationForm() {
	const [form, setForm] = useState<FormState>({ fullName: "", email: "", phone: "", message: "" });
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [error, setError] = useState<string>("");

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");
		setError("");
		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form),
			});
			if (!res.ok) throw new Error("Greška prilikom slanja formulara.");
			setStatus("success");
			setForm({ fullName: "", email: "", phone: "", message: "" });
		} catch (err: unknown) {
			setStatus("error");
			setError(err instanceof Error ? err.message : "Došlo je do greške.");
		}
	};

	return (
		<form className="card" onSubmit={onSubmit}>
			<div className="row">
				<div>
					<label>Ime i prezime</label>
					<input className="input" required placeholder="Vaše ime" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
				</div>
				<div>
					<label>Email</label>
					<input className="input" required type="email" placeholder="email@primer.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
				</div>
			</div>
			<div className="row">
				<div>
					<label>Telefon (opciono)</label>
					<input className="input" placeholder="+381 60 123 4567" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
				</div>
				<div>
					<label>Poruka (opciono)</label>
					<textarea className="textarea" placeholder="Dodatne informacije" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
				</div>
			</div>
			<div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
				<button className="btn" disabled={status === "loading"}>{status === "loading" ? "Slanje..." : "Pošalji"}</button>
			</div>
			{status === "success" && <p style={{ color: "#059669", marginTop: 8 }}>Uspešno poslato. Hvala!</p>}
			{status === "error" && <p style={{ color: "#b91c1c", marginTop: 8 }}>{error}</p>}
		</form>
	);
}


