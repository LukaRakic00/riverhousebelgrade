"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Box,
	Card,
	CardBody,
	Container,
	Heading,
	Input,
	Stack,
	Text,
	Button,
	useToast,
	VStack,
	InputGroup,
	InputLeftElement,
	Icon,
	FormControl,
	FormLabel,
	Alert,
	AlertIcon,
} from "@chakra-ui/react";
import { FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import Image from "next/image";

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

	const logoUrl = 'https://res.cloudinary.com/dvohrn0zf/image/upload/v1762935030/s25-removebg-preview_yquban.png';

	return (
		<Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }} display="flex" alignItems="center" justifyContent="center" py={12}>
			<Container maxW="md">
				<VStack spacing={8}>
					{/* Logo */}
					<Box>
						<Image
							src={logoUrl}
							alt="Belgrade River House"
							width={180}
							height={90}
							style={{ height: 'auto', maxHeight: '90px', width: 'auto' }}
							priority
						/>
					</Box>

					{/* Login Card */}
					<Card 
						w="100%" 
						boxShadow="xl" 
						borderRadius="xl" 
						bg="white" 
						_dark={{ bg: "gray.800" }}
					>
						<CardBody p={8}>
							<VStack spacing={6} align="stretch">
								<VStack spacing={2}>
									<Heading size="lg" color="gray.800" _dark={{ color: "white" }}>
										Admin Panel
									</Heading>
									<Text color="gray.600" _dark={{ color: "gray.400" }} fontSize="sm">
										Prijavite se za pristup administraciji
									</Text>
								</VStack>

								<form onSubmit={onSubmit}>
									<VStack spacing={4}>
										<FormControl>
											<FormLabel color="gray.700" _dark={{ color: "gray.300" }}>
												Korisničko ime
											</FormLabel>
											<InputGroup>
												<InputLeftElement pointerEvents="none">
													<Icon as={FiUser} color="gray.400" />
												</InputLeftElement>
												<Input
													placeholder="Unesite korisničko ime"
													value={username}
													onChange={(e) => setUsername(e.target.value)}
													required
													size="lg"
													borderRadius="md"
													bg="gray.50"
													_dark={{ bg: "gray.700" }}
													_focus={{
														bg: "white",
														_dark: { bg: "gray.600" },
														borderColor: "purple.500",
														boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
													}}
												/>
											</InputGroup>
										</FormControl>

										<FormControl>
											<FormLabel color="gray.700" _dark={{ color: "gray.300" }}>
												Lozinka
											</FormLabel>
											<InputGroup>
												<InputLeftElement pointerEvents="none">
													<Icon as={FiLock} color="gray.400" />
												</InputLeftElement>
												<Input
													type="password"
													placeholder="Unesite lozinku"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
													required
													size="lg"
													borderRadius="md"
													bg="gray.50"
													_dark={{ bg: "gray.700" }}
													_focus={{
														bg: "white",
														_dark: { bg: "gray.600" },
														borderColor: "purple.500",
														boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
													}}
												/>
											</InputGroup>
										</FormControl>

										{error && (
											<Alert status="error" borderRadius="md">
												<AlertIcon />
												{error}
											</Alert>
										)}

										<Button
											type="submit"
											colorScheme="purple"
											size="lg"
											w="100%"
											isLoading={loading}
											rightIcon={<FiArrowRight />}
											borderRadius="md"
											_hover={{
												transform: "translateY(-2px)",
												boxShadow: "lg",
											}}
											transition="all 0.2s"
										>
											Prijavi se
										</Button>
									</VStack>
								</form>
							</VStack>
						</CardBody>
					</Card>

					<Text fontSize="xs" color="gray.500" textAlign="center">
						© {new Date().getFullYear()} Belgrade River House. Sva prava zadržana.
					</Text>
				</VStack>
			</Container>
		</Box>
	);
}
