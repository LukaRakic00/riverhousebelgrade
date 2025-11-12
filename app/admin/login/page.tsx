"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Card,
	CardBody,
	CardHeader,
	Container,
	Heading,
	Input,
	Stack,
	Text,
	Button,
	useToast,
} from "@chakra-ui/react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function AdminLoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const router = useRouter();
	const toast = useToast();

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await fetch("/api/admin/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data?.error || "Prijava neuspešna.");
			}
			toast({ title: "Uspešna prijava", status: "success" });
			router.replace("/admin");
		} catch (err: any) {
			setError(err.message || "Došlo je do greške.");
			toast({ title: "Greška", description: err.message, status: "error" });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxW="container.sm" py={12}>
			<Card borderWidth="1px" bg="white" _dark={{ bg: "gray.800" }}>
				<CardHeader>
					<Heading size="md" color="gray.800" _dark={{ color: "white" }}>Admin prijava</Heading>
				</CardHeader>
				<CardBody>
					<form onSubmit={onSubmit}>
						<Stack spacing={3}>
							<Input placeholder="Korisničko ime" value={username} onChange={(e) => setUsername(e.target.value)} required />
							<Input placeholder="Lozinka" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
							<Button type="submit" colorScheme="purple" isLoading={loading}>Prijavi se</Button>
							{error && <Text color="red.400">{error}</Text>}
						</Stack>
					</form>
				</CardBody>
			</Card>
		</Container>
	);
}


