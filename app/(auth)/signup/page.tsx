"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Container,
	Heading,
	Input,
	Stack,
	Text,
	useToast,
} from "@chakra-ui/react";

export default function SignupPage() {
	const toast = useToast();
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, password }),
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				throw new Error(d?.error || "Registracija neuspešna.");
			}
			toast({ title: "Uspešna registracija", status: "success" });
			router.replace("/");
		} catch (e: any) {
			setError(e?.message || "Greška pri registraciji.");
			toast({ title: "Greška", description: e?.message, status: "error" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxW="container.sm" py={10}>
			<Card>
				<CardHeader>
					<Heading size="md">Registracija</Heading>
				</CardHeader>
				<CardBody>
					<form onSubmit={onSubmit}>
						<Stack spacing={3}>
							<Input placeholder="Ime i prezime" value={name} onChange={(e) => setName(e.target.value)} required />
							<Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
							<Input placeholder="Lozinka" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
							<Button type="submit" colorScheme="purple" isLoading={loading}>Registruj se</Button>
							{error && <Text color="red.300">{error}</Text>}
						</Stack>
					</form>
				</CardBody>
			</Card>
		</Container>
	);
}

