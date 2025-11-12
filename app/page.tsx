"use client";

import { Providers } from "./(marketing)/providers";
import { MarketingLayout as TemplateLayout } from "#components/layout/marketing-layout";

import {
	Box,
	Button,
	ButtonGroup,
	Container,
	Flex,
	HStack,
	Heading,
	Icon,
	SimpleGrid,
	Stack,
	Text,
	VStack,
	Card,
	CardBody,
	CardHeader,
	Input,
	useColorModeValue,
} from "@chakra-ui/react";
import { Br } from "@saas-ui/react";
import { motion } from "framer-motion";
import {
	FiArrowRight,
	FiCheck,
	FiMapPin,
	FiWifi,
	FiUsers,
	FiHome,
	FiStar,
	FiZoomIn,
} from "react-icons/fi";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import * as React from "react";
import { useEffect, useState } from "react";

import { ButtonLink } from "#components/button-link/button-link";
import { Faq } from "#components/faq";
import faq from "#data/faq";
import { SafeImage } from "../components/SafeImage";

type SiteConfig = { heroImageUrl: string; galleryImageUrls: string[] };

export default function HomePage() {
	const [config, setConfig] = useState<SiteConfig | null>(null);
	const [heroIdx, setHeroIdx] = useState(0);
	useEffect(() => {
		fetch("/api/images", { cache: "no-store" })
			.then((r) => r.json())
			.then((d) => setConfig(d))
			.catch(() => setConfig(null));
	}, []);
	const heroImages = React.useMemo(() => {
		const arr = [...(config?.galleryImageUrls || [])];
		if (config?.heroImageUrl) arr.unshift(config.heroImageUrl);
		return arr.filter(Boolean);
	}, [config]);
	useEffect(() => {
		if (!heroImages.length) return;
		const id = setInterval(() => {
			setHeroIdx((i) => (i + 1) % heroImages.length);
		}, 5000);
		return () => clearInterval(id);
	}, [heroImages.length]);
	return (
		<Box bg="black" color="white">
			<HeroSection heroUrl={heroImages[heroIdx]} />
			<FeaturesSection />
			<GallerySection images={config?.galleryImageUrls || []} />
			<RegistrationSection />
			<FaqSection />
		</Box>
	);
}

const AnimatedText: React.FC<{ children: string; delay?: number }> = ({ children, delay = 0 }) => {
	const words = children.split(" ");
	return (
		<>
			{words.map((word, i) => (
				<motion.span
					key={i}
					initial={{ opacity: 0, y: 30, scale: 0.9 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{
						duration: 0.4,
						delay: delay + i * 0.06,
						type: "spring",
						stiffness: 120,
						damping: 13,
					}}
					style={{ display: "inline-block", marginRight: "0.3em" }}
				>
					{word}
				</motion.span>
			))}
		</>
	);
};

const HeroSection: React.FC<{ heroUrl?: string }> = ({ heroUrl }) => {
	return (
		<Box
			position="relative"
			minH={{ base: "100vh", md: "100vh" }}
			display="flex"
			alignItems="center"
			justifyContent="center"
			overflow="hidden"
		>
			{heroUrl && (
				<Box
					position="absolute"
					top="0"
					left="0"
					right="0"
					bottom="0"
					zIndex={0}
				>
					<SafeImage
						src={heroUrl}
						width={1920}
						height={1080}
						alt="River House"
						quality={90}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							filter: "brightness(0.4)",
						}}
						priority
					/>
				</Box>
			)}
			<Box
				position="absolute"
				top="0"
				left="0"
				right="0"
				bottom="0"
				bg="linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8))"
				zIndex={1}
			/>
			<Container maxW="container.xl" position="relative" zIndex={2} px={{ base: 4, md: 8 }} py={{ base: 20, md: 0 }}>
				<VStack spacing={{ base: 6, md: 8 }} alignItems="center" textAlign="center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
					>
						<Text
							fontSize={{ base: "xs", md: "sm" }}
							color="gray.400"
							letterSpacing={{ base: "0.15em", md: "0.2em" }}
							textTransform="uppercase"
							mb={{ base: 3, md: 4 }}
							px={2}
						>
							Premium Vikendica
						</Text>
					</motion.div>
					<Heading
						as="h1"
						fontSize={{ base: "3xl", sm: "4xl", md: "6xl", lg: "7xl", xl: "8xl" }}
						fontWeight="300"
						lineHeight="1.1"
						letterSpacing={{ base: "-0.01em", md: "-0.02em" }}
						color="white"
						mb={{ base: 4, md: 6 }}
						px={{ base: 2, md: 0 }}
					>
						<AnimatedText delay={0.2}>Belgrade</AnimatedText>
						<Br />
						<AnimatedText delay={0.8}>River House</AnimatedText>
					</Heading>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 1.2 }}
					>
						<Text
							fontSize={{ base: "base", sm: "lg", md: "xl", lg: "2xl" }}
							fontWeight="300"
							color="gray.300"
							maxW="700px"
							lineHeight={{ base: "1.5", md: "1.6" }}
							mb={{ base: 8, md: 10 }}
							px={{ base: 2, md: 0 }}
						>
							Raj na vodi. Mirno mesto za odmor sa prelepim pogledom. Uživaj uz moderan enterijer,
							terasu na vodi i prijatan ambijent za vikend beg iz grada.
						</Text>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 1.5 }}
						style={{ width: "100%", maxWidth: "500px" }}
					>
						<VStack spacing={{ base: 4, md: 6 }} w="100%">
							<ButtonLink
								size="lg"
								href="#galerija"
								w="100%"
								px={{ base: 8, md: 10 }}
								py={{ base: 6, md: 8 }}
								fontSize={{ base: "md", md: "lg" }}
								fontWeight="400"
								letterSpacing="0.05em"
								borderRadius="none"
								bg="white"
								color="black"
								textTransform="uppercase"
								minH={{ base: "56px", md: "64px" }}
								_active={{
									transform: "scale(0.98)",
								}}
								_hover={{
									bg: "gray.100",
									transform: "translateY(-2px)",
									boxShadow: "0 10px 40px rgba(255,255,255,0.2)",
								}}
								transition="all 0.3s ease"
							>
								Galerija
							</ButtonLink>
							<ButtonLink
								size="lg"
								href="#kontakt"
								variant="outline"
								w="100%"
								px={{ base: 8, md: 10 }}
								py={{ base: 6, md: 8 }}
								fontSize={{ base: "md", md: "lg" }}
								fontWeight="400"
								letterSpacing="0.05em"
								borderRadius="none"
								borderWidth="1px"
								borderColor="white"
								color="white"
								textTransform="uppercase"
								bg="transparent"
								minH={{ base: "56px", md: "64px" }}
								_active={{
									transform: "scale(0.98)",
								}}
								_hover={{
									bg: "rgba(255,255,255,0.1)",
									borderColor: "gray.300",
									transform: "translateY(-2px)",
								}}
								transition="all 0.3s ease"
								rightIcon={<Icon as={FiArrowRight} />}
							>
								Rezervacija
							</ButtonLink>
						</VStack>
					</motion.div>
				</VStack>
			</Container>
			<Box
				position="absolute"
				bottom={{ base: "20px", md: "40px" }}
				left="50%"
				transform="translateX(-50%)"
				zIndex={2}
				display={{ base: "none", md: "block" }}
			>
				<motion.div
					animate={{ y: [0, 10, 0] }}
					transition={{ duration: 2, repeat: Infinity }}
				>
					<Icon as={FiArrowRight} transform="rotate(90deg)" fontSize="2xl" color="white" opacity={0.6} />
				</motion.div>
			</Box>
		</Box>
	);
};

const FeaturesSection = () => {
	const features = [
		{
			icon: FiMapPin,
			title: "Lokacija",
			description: "U srcu Beograda, na vodi. Savršeno za vikend odmor i posebne prilike.",
			details: "Krovna terasa • Pogled na reku",
		},
		{
			icon: FiHome,
			title: "Komfor",
			description: "Moderno opremljen prostor, idealan za 2–6 osoba.",
			details: "Prostran dnevni boravak",
		},
		{
			icon: FiWifi,
			title: "Pogodnosti",
			description: "Brzi Wi‑Fi, kompletna kuhinja, klima, terasa na vodi.",
			details: "Wi‑Fi i pametna TV",
		},
	];

	return (
		<Box id="benefits" py={{ base: 16, md: 32 }} bg="black">
			<Container maxW="container.xl" px={{ base: 4, md: 8 }}>
				<VStack spacing={{ base: 12, md: 16 }}>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<Text
							fontSize={{ base: "xs", md: "sm" }}
							color="gray.500"
							letterSpacing={{ base: "0.15em", md: "0.2em" }}
							textTransform="uppercase"
							textAlign="center"
							mb={{ base: 3, md: 4 }}
						>
							Zašto Belgrade River House
						</Text>
						<Heading
							as="h2"
							fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
							fontWeight="300"
							letterSpacing={{ base: "-0.01em", md: "-0.02em" }}
							textAlign="center"
							color="white"
							px={{ base: 2, md: 0 }}
						>
							Iskustvo koje se pamti
						</Heading>
					</motion.div>
					<SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 6, md: 8 }} w="100%">
						{features.map((feature, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: i * 0.15 }}
							>
								<Card
									bg="gray.900"
									borderWidth="1px"
									borderColor="gray.800"
									borderRadius="none"
									p={{ base: 6, md: 8 }}
									h="100%"
									_hover={{
										borderColor: "gray.700",
										transform: { base: "none", md: "translateY(-4px)" },
									}}
									transition="all 0.3s ease"
								>
									<VStack align="flex-start" spacing={{ base: 3, md: 4 }}>
										<Box
											w={{ base: "50px", md: "60px" }}
											h={{ base: "50px", md: "60px" }}
											bg="white"
											color="black"
											borderRadius="none"
											display="flex"
											alignItems="center"
											justifyContent="center"
											mb={2}
										>
											<Icon as={feature.icon} fontSize={{ base: "xl", md: "2xl" }} />
										</Box>
										<Heading as="h3" fontSize={{ base: "lg", md: "xl" }} fontWeight="400" color="white">
											{feature.title}
										</Heading>
										<Text color="gray.400" lineHeight="1.7" fontSize={{ base: "sm", md: "md" }}>
											{feature.description}
										</Text>
										<HStack color="gray.500" fontSize={{ base: "xs", md: "sm" }} mt={2} flexWrap="wrap">
											<Icon as={feature.icon} />
											<Text>{feature.details}</Text>
										</HStack>
									</VStack>
								</Card>
							</motion.div>
						))}
					</SimpleGrid>
				</VStack>
			</Container>
		</Box>
	);
};

const GallerySection: React.FC<{ images: string[] }> = ({ images }) => {
	if (!images || images.length === 0) return null;

	return (
		<Box id="galerija" py={{ base: 16, md: 32 }} bg="black">
			<Container maxW="container.xl" px={{ base: 4, md: 8 }}>
				<VStack spacing={{ base: 8, md: 12 }}>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
					>
						<Text
							fontSize={{ base: "xs", md: "sm" }}
							color="gray.500"
							letterSpacing={{ base: "0.15em", md: "0.2em" }}
							textTransform="uppercase"
							textAlign="center"
							mb={{ base: 3, md: 4 }}
						>
							Galerija
						</Text>
						<Heading
							as="h2"
							fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
							fontWeight="300"
							letterSpacing={{ base: "-0.01em", md: "-0.02em" }}
							textAlign="center"
							color="white"
							px={{ base: 2, md: 0 }}
						>
							Uživaj u prirodi
						</Heading>
					</motion.div>
					<PhotoProvider>
						<SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 3, md: 4 }} w="100%">
							{images.map((src, i) => (
								<motion.div
									key={i}
									initial={{ opacity: 0, scale: 0.9 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true, margin: "-50px" }}
									transition={{ duration: 0.4, delay: i * 0.08 }}
								>
									<PhotoView src={src}>
										<Box
											position="relative"
											overflow="hidden"
											borderRadius="none"
											aspectRatio={4 / 3}
											cursor="pointer"
											transition="all 0.3s ease"
											sx={{ touchAction: "manipulation" }}
											_hover={{
												transform: { base: "none", md: "scale(1.02)" },
											}}
											_active={{
												transform: "scale(0.98)",
											}}
										>
											<SafeImage
												src={src}
												alt={`Gallery ${i + 1}`}
												width={800}
												height={600}
												style={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
												}}
											/>
											<Box
												position="absolute"
												inset="0"
												bg="black"
												opacity={0}
												_hover={{ opacity: { base: 0, md: 0.3 } }}
												transition="opacity 0.3s ease"
											/>
											<Box
												position="absolute"
												top="50%"
												left="50%"
												transform="translate(-50%, -50%)"
												opacity={0}
												_hover={{ opacity: { base: 0, md: 1 } }}
												transition="opacity 0.3s ease"
												pointerEvents="none"
											>
												<Icon
													as={FiZoomIn}
													boxSize={8}
													color="white"
													filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))"
												/>
											</Box>
										</Box>
									</PhotoView>
								</motion.div>
							))}
						</SimpleGrid>
					</PhotoProvider>
				</VStack>
			</Container>
		</Box>
	);
};

const RegistrationSection: React.FC = () => {
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [ok, setOk] = useState(false);

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setOk(false);
		setLoading(true);
		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, email, phone, message }),
			});
			if (!res.ok) {
				const d = await res.json().catch(() => ({}));
				throw new Error(d?.error || "Registracija neuspešna.");
			}
			setOk(true);
			setFullName("");
			setEmail("");
			setPhone("");
			setMessage("");
		} catch (e: any) {
			setError(e?.message || "Greška pri registraciji.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box id="kontakt" py={{ base: 16, md: 32 }} bg="black">
			<Container maxW="container.md" px={{ base: 4, md: 8 }}>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<VStack spacing={{ base: 8, md: 12 }}>
						<VStack spacing={{ base: 3, md: 4 }} textAlign="center">
							<Text
								fontSize={{ base: "xs", md: "sm" }}
								color="gray.500"
								letterSpacing={{ base: "0.15em", md: "0.2em" }}
								textTransform="uppercase"
							>
								Kontakt
							</Text>
							<Heading
								as="h2"
								fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
								fontWeight="300"
								letterSpacing={{ base: "-0.01em", md: "-0.02em" }}
								color="white"
								px={{ base: 2, md: 0 }}
							>
								Rezerviši svoj boravak
							</Heading>
							<Text color="gray.400" fontSize={{ base: "md", md: "lg" }} maxW="600px" px={{ base: 2, md: 0 }}>
								Popuni formu i mi ćemo ti se javiti u najkraćem roku.
							</Text>
						</VStack>
						<Card
							bg="gray.900"
							borderWidth="1px"
							borderColor="gray.800"
							borderRadius="none"
							w="100%"
							p={{ base: 6, md: 8 }}
						>
							<form onSubmit={onSubmit}>
								<VStack spacing={{ base: 5, md: 6 }}>
									<SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 4 }} w="100%">
										<Input
											placeholder="Ime i prezime"
											value={fullName}
											onChange={(e) => setFullName(e.target.value)}
											required
											bg="black"
											borderColor="gray.800"
											color="white"
											borderRadius="none"
											fontSize={{ base: "md", md: "lg" }}
											h={{ base: "48px", md: "56px" }}
											_focus={{ borderColor: "white" }}
											_placeholder={{ color: "gray.600" }}
										/>
										<Input
											type="email"
											placeholder="Email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
											bg="black"
											borderColor="gray.800"
											color="white"
											borderRadius="none"
											fontSize={{ base: "md", md: "lg" }}
											h={{ base: "48px", md: "56px" }}
											_focus={{ borderColor: "white" }}
											_placeholder={{ color: "gray.600" }}
										/>
									</SimpleGrid>
									<Input
										placeholder="Telefon"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										bg="black"
										borderColor="gray.800"
										color="white"
										borderRadius="none"
										fontSize={{ base: "md", md: "lg" }}
										h={{ base: "48px", md: "56px" }}
										_focus={{ borderColor: "white" }}
										_placeholder={{ color: "gray.600" }}
									/>
									<Input
										as="textarea"
										rows={6}
										placeholder="Poruka (opciono)"
										value={message}
										onChange={(e: any) => setMessage(e.target.value)}
										bg="black"
										borderColor="gray.800"
										color="white"
										borderRadius="none"
										fontSize={{ base: "md", md: "lg" }}
										minH={{ base: "120px", md: "150px" }}
										_focus={{ borderColor: "white" }}
										_placeholder={{ color: "gray.600" }}
									/>
									<Button
										type="submit"
										size="lg"
										w="100%"
										px={{ base: 8, md: 10 }}
										py={{ base: 6, md: 8 }}
										fontSize={{ base: "md", md: "lg" }}
										fontWeight="400"
										letterSpacing="0.05em"
										borderRadius="none"
										bg="white"
										color="black"
										textTransform="uppercase"
										isLoading={loading}
										minH={{ base: "56px", md: "64px" }}
										_active={{
											transform: "scale(0.98)",
										}}
										_hover={{
											bg: "gray.100",
											transform: "translateY(-2px)",
										}}
										transition="all 0.3s ease"
									>
										Pošalji
									</Button>
									{ok && (
										<Text color="green.400" fontSize={{ base: "sm", md: "md" }} textAlign="center">
											Hvala! Uskoro ćemo ti se javiti.
										</Text>
									)}
									{error && (
										<Text color="red.400" fontSize={{ base: "sm", md: "md" }} textAlign="center">
											{error}
										</Text>
									)}
								</VStack>
							</form>
						</Card>
					</VStack>
				</motion.div>
			</Container>
		</Box>
	);
};

const FaqSection = () => {
	return (
		<Box py={{ base: 16, md: 32 }} bg="black">
			<Container maxW="container.lg" px={{ base: 4, md: 8 }}>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<VStack spacing={{ base: 8, md: 12 }}>
						<VStack spacing={{ base: 3, md: 4 }} textAlign="center">
							<Text
								fontSize={{ base: "xs", md: "sm" }}
								color="gray.500"
								letterSpacing={{ base: "0.15em", md: "0.2em" }}
								textTransform="uppercase"
							>
								Često postavljana pitanja
							</Text>
							<Heading
								as="h2"
								fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
								fontWeight="300"
								letterSpacing={{ base: "-0.01em", md: "-0.02em" }}
								color="white"
								px={{ base: 2, md: 0 }}
							>
								Informacije
							</Heading>
						</VStack>
						<Box w="100%">
							<Faq {...faq} />
						</Box>
					</VStack>
				</motion.div>
			</Container>
		</Box>
	);
};
