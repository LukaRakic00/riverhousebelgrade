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
	IconButton,
	SimpleGrid,
	Stack,
	Text,
	VStack,
	Card,
	CardBody,
	CardHeader,
	Input,
	Spinner,
	Tag,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { Br } from "@saas-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
	FiArrowRight,
	FiCheck,
	FiMapPin,
	FiWifi,
	FiUsers,
	FiHome,
	FiStar,
	FiZoomIn,
	FiUpload,
	FiX,
} from "react-icons/fi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ButtonLink } from "#components/button-link/button-link";
import { Faq } from "#components/faq";
import faq from "#data/faq";
import { SafeImage } from "../components/SafeImage";

type SiteConfig = { heroImageUrl: string; featuredImages: string[]; instagramImages: string[] };

export default function HomePage() {
	const [config, setConfig] = useState<SiteConfig | null>(null);
	useEffect(() => {
		fetch("/api/images", { cache: "no-store" })
			.then((r) => r.json())
			.then((d) => setConfig(d))
			.catch(() => setConfig(null));
	}, []);
	return (
		<Box bg="black" color="white">
			<HeroSection heroUrl={config?.heroImageUrl || ""} />
			<FeaturesSection />
			<AboutSection />
			<GallerySection images={config?.featuredImages || []} />
			<GoogleReviewsSection />
			<BookingSection />
			<InstagramSection images={config?.instagramImages || []} />
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

const MobileSnapCarousel: React.FC<{ items: React.ReactNode[]; cardWidth?: string }> = ({ items, cardWidth = "85%" }) => {
	return (
		<Box
			w="100%"
			display="flex"
			overflowX="auto"
			gap={4}
			scrollSnapType="x mandatory"
			px={1}
			py={2}
			sx={{
				scrollbarWidth: "none",
				msOverflowStyle: "none",
				"&::-webkit-scrollbar": { display: "none" },
			}}
		>
			{items.map((item, idx) => (
				<Box key={idx} flex="0 0 auto" w={cardWidth} scrollSnapAlign="center">
					{item}
				</Box>
			))}
		</Box>
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
			<Container maxW="container.xl" position="relative" zIndex={2} px={{ base: 4, md: 8 }} py={{ base: 36, md: 12 }}>
				<VStack spacing={{ base: 6, md: 8 }} alignItems="center" textAlign="center" mt={{ base: 12, md: 16 }}>
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
								href="/galerija"
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
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const isTouch = useBreakpointValue({ base: true, md: false });

	const slides = [
		{
			icon: FiMapPin,
			title: "Luksuzni mir uz reku",
			description: "Smeštena na jedinstvenoj lokaciji uz obalu reke, samo nekoliko minuta od srca Beograda. Savršeno utočište za spoj modernog komfora, privatnosti i prelepog pogleda na grad.",
		},
		{
			icon: FiHome,
			title: "Privatni bazen i relaksacija",
			customDescription: (
				<VStack align="center" spacing={{ base: 3, md: 4 }} color="gray.300" textAlign="center">
					<Box
						bg="rgba(255,255,255,0.05)"
						border="1px solid"
						borderColor="rgba(255,255,255,0.1)"
						borderRadius="lg"
						px={{ base: 3, md: 4 }}
						py={{ base: 2, md: 3 }}
					>
						<Text fontWeight="600" color="yellow.300" textTransform="uppercase" letterSpacing="0.1em">
							Privatni spa trenutak
						</Text>
					</Box>
					<Text fontSize={{ base: "sm", md: "md" }}>
						Sezonski bazen na otvorenom, sauna i hidromasažna kada – sve u službi potpunog resetovanja tela i uma.
					</Text>
					<VStack align="center" spacing={2} fontSize={{ base: "sm", md: "md" }}>
						<Text>Terasa nad rekom za prve jutarnje kafe i zlatne zalaske.</Text>
						<Text>Savršeno mesto za romantični vikend, proslavu ili mini retreat.</Text>
						<Text>Uređeno dvorište i prirodni hlad stvaraju filmski ambijent.</Text>
					</VStack>
				</VStack>
			),
		},
		{
			icon: FiUsers,
			title: "Komforna vila",
			description: "Dve kompletno uređene spavaće sobe, prostran dnevni boravak sa flat-screen TV-om, moderno opremljena kuhinja i trpezarija. Kompletna posteljina i peškiri vrhunskog kvaliteta.",
		},
		{
			icon: FiStar,
			title: "Privatnost i pogodnosti",
			description: "Besplatan privatni parking za vaše vozilo. Klimatizovana vila pažljivo uređena kako bi pružila osećaj doma i ekskluzivnosti. Terasa sa panoramskim pogledom na Beograd i reku.",
		},
		{
			icon: FiMapPin,
			title: "Savršena lokacija",
			description: "Trg republike 5,3 km • Hram Svetog Save 6,4 km • Aerodrom Nikola Tesla 19 km. Centar grada na nekoliko minuta vožnje, idealno za poslovni boravak, odmor ili proslavu posebnog trenutka.",
		},
		{
			icon: FiStar,
			title: "Iskustvo koje se pamti",
			description: "Belgrade River House – mesto gde se luksuz, udobnost i pogled na reku spajaju u nezaboravno iskustvo. Gde se luksuz susreće sa spokojem, a Beograd pokazuje svoje najlepše lice.",
		},
	];

	// Auto-slide na svakih 7 sekundi
	useEffect(() => {
		if (slides.length <= 1 || isPaused || isTouch) return;
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 7000);
		return () => clearInterval(interval);
	}, [slides.length, isPaused, isTouch]);

	const handleSlideChange = (newSlide: number) => {
		if (newSlide < 0 || newSlide >= slides.length) return;
		setIsPaused(true);
		setCurrentSlide(newSlide);
		setTimeout(() => setIsPaused(false), 7000);
	};

	const handlePrev = () => {
		const newSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
		handleSlideChange(newSlide);
	};

	const handleNext = () => {
		const newSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
		handleSlideChange(newSlide);
	};

	return (
		<Box id="benefits" py={{ base: 16, md: 32 }} bg="black">
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

					{isTouch ? (
						<MobileSnapCarousel
							items={slides.map((slide, idx) => (
								<Card
									key={idx}
									bg="gray.900"
									borderWidth="1px"
									borderColor="gray.800"
									borderRadius="lg"
									p={6}
									display="flex"
									minH={{ base: "360px", md: "auto" }}
								>
									<VStack spacing={4} align="stretch" h="100%" justify="space-between">
										<HStack spacing={4}>
											<Box
												w="56px"
												h="56px"
												bg="yellow.400"
												color="black"
												borderRadius="md"
												display="flex"
												alignItems="center"
												justifyContent="center"
											>
												<Icon as={slide.icon} fontSize="2xl" />
											</Box>
											<Heading as="h3" fontSize="lg" fontWeight="500" color="white">
												{slide.title}
											</Heading>
										</HStack>
										<Text color="gray.300" lineHeight="1.7" fontSize="sm">
											{slide.description}
										</Text>
									</VStack>
								</Card>
							))}
						/>
					) : (
					<Box
						w="100%"
						maxW="900px"
						mx="auto"
						position="relative"
						onMouseEnter={() => setIsPaused(true)}
						onMouseLeave={() => setIsPaused(false)}
					>
						{/* Navigation arrows */}
						{slides.length > 1 && (
							<>
								<IconButton
									aria-label="Prethodni slajd"
									icon={<FiArrowRight style={{ transform: "rotate(180deg)" }} />}
									position="absolute"
									left={{ base: 2, md: -12 }}
									top="50%"
									transform="translateY(-50%)"
									zIndex={3}
									bg="gray.900"
									color="yellow.400"
									borderWidth="1px"
									borderColor="yellow.400"
									borderRadius="full"
									_hover={{ bg: "yellow.400", color: "black" }}
									onClick={handlePrev}
									display={{ base: "none", md: "flex" }}
								/>
								<IconButton
									aria-label="Sledeći slajd"
									icon={<FiArrowRight />}
									position="absolute"
									right={{ base: 2, md: -12 }}
									top="50%"
									transform="translateY(-50%)"
									zIndex={3}
									bg="gray.900"
									color="yellow.400"
									borderWidth="1px"
									borderColor="yellow.400"
									borderRadius="full"
									_hover={{ bg: "yellow.400", color: "black" }}
									onClick={handleNext}
									display={{ base: "none", md: "flex" }}
								/>
							</>
						)}

							<Box overflow="hidden" borderRadius="none" position="relative" w="100%">
							<Flex
								w={`${slides.length * 100}%`}
								style={{
									transform: `translateX(-${currentSlide * (100 / slides.length)}%)`,
									transition: "transform 0.6s ease-in-out",
									display: "flex",
								}}
							>
								{slides.map((slide, idx) => (
										<Box key={idx} w={`${100 / slides.length}%`} flexShrink={0} px={{ base: 2, md: 4 }}>
										<Card
											bg="gray.900"
											borderWidth="1px"
											borderColor={currentSlide === idx ? "yellow.400" : "gray.800"}
											borderRadius="none"
											p={{ base: 6, md: 10 }}
											w="100%"
											h="100%"
											_hover={{
												borderColor: "yellow.400",
											}}
											transition="all 0.3s ease"
										>
											<VStack spacing={{ base: 4, md: 6 }} align="center" textAlign="center">
												<Box
													w={{ base: "60px", md: "80px" }}
													h={{ base: "60px", md: "80px" }}
													bg="yellow.400"
													color="black"
													borderRadius="none"
													display="flex"
													alignItems="center"
													justifyContent="center"
													mb={2}
												>
													<Icon as={slide.icon} fontSize={{ base: "2xl", md: "3xl" }} />
												</Box>
												<Heading
													as="h3"
													fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
													fontWeight="400"
													color="white"
													px={{ base: 2, md: 0 }}
												>
													{slide.title}
												</Heading>
												{slide.customDescription ? (
													<Box w="100%" px={{ base: 2, md: 0 }}>{slide.customDescription}</Box>
												) : (
												<Text
													color="gray.300"
													lineHeight={{ base: "1.7", md: "1.8" }}
													fontSize={{ base: "sm", md: "md", lg: "lg" }}
													maxW="700px"
													px={{ base: 2, md: 0 }}
												>
													{slide.description}
												</Text>
													)}
											</VStack>
										</Card>
									</Box>
								))}
							</Flex>
						</Box>

						{/* Navigation dots */}
						{slides.length > 1 && (
							<HStack spacing={2} justify="center" mt={{ base: 6, md: 8 }}>
								{slides.map((_, idx) => (
									<Box
										key={idx}
										w={currentSlide === idx ? "32px" : "8px"}
										h="8px"
										bg={currentSlide === idx ? "yellow.400" : "gray.600"}
										borderRadius="full"
										cursor="pointer"
										onClick={() => handleSlideChange(idx)}
										transition="all 0.3s ease"
										sx={{ touchAction: "manipulation" }}
									/>
								))}
							</HStack>
						)}
					</Box>
					)}
				</VStack>
			</Container>
		</Box>
	);
};

const AboutSection = () => {
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const isTouch = useBreakpointValue({ base: true, md: false });

	const slides = [
		{
			title: "Belgrade River House – luksuzni mir uz reku",
			content: (
				<VStack spacing={{ base: 4, md: 6 }} align="stretch">
					<Box
						bg="rgba(255,255,255,0.05)"
						borderRadius="xl"
						boxShadow="0 15px 45px rgba(0,0,0,0.35)"
						p={{ base: 3, md: 4 }}
						border="1px solid"
						borderColor="rgba(255,255,255,0.08)"
					>
						<Text
							fontSize={{ base: "xs", md: "sm" }}
							color="yellow.300"
							fontWeight="600"
							textTransform="uppercase"
							letterSpacing="0.08em"
						>
							Luksuzni mir uz reku
						</Text>
						<Text fontSize={{ base: "xs", md: "sm" }} color="white" fontWeight="500" mt={2}>
							Samo nekoliko minuta od centra, a potpuno skrivena u svojoj oazi mira.
						</Text>
						<Text fontSize={{ base: "xs", md: "sm" }} color="gray.300" lineHeight="1.7" mt={2}>
							Privatna terasa nad rekom, vedri enterijer i uređeno dvorište pripremaju scenu za svaki ritual – od jutarnje kafe do elegantne večeri.
						</Text>
					</Box>
					<Box
						bg="blackAlpha.400"
						borderRadius="lg"
						p={{ base: 3, md: 4 }}
						border="1px solid"
						borderColor="rgba(255,255,255,0.05)"
					>
						<Text fontSize={{ base: "xs", md: "sm" }} color="gray.300" lineHeight="1.7">
							Savršen izbor za sve koji žele da se isključe iz gradske svakodnevnice, a ipak zadrže blizinu gradskog ritma.
						</Text>
					</Box>
				</VStack>
			),
		},
		{
			title: "Privatni bazen i relaksacija",
			content: (
				<VStack spacing={{ base: 4, md: 5 }} align="stretch">
					<Box
						bg="gray.800"
						borderLeft="3px solid"
						borderColor="yellow.400"
						p={{ base: 4, md: 5 }}
						borderRadius="md"
					>
						<Text fontSize={{ base: "sm", md: "md" }} color="white" fontWeight="500" mb={2}>
							Privatni spa trenutak
					</Text>
						<Text fontSize={{ base: "xs", md: "sm" }} color="gray.300" lineHeight="1.7">
							Sezonski bazen na otvorenom, sauna i hidromasažna kada – sve u službi potpunog resetovanja tela i uma.
					</Text>
					</Box>
					<VStack align="stretch" spacing={3}>
						{[
							"Terasa nad rekom za prve jutarnje kafe i zlatne zalaske.",
							"Savršeno mesto za romantični vikend, proslavu ili mini retreat.",
							"Uređeno dvorište i prirodni hlad stvaraju filmski ambijent.",
						].map((item, i) => (
							<HStack key={i} spacing={3} align="flex-start">
								<Icon as={FiCheck} color="yellow.400" mt={1} />
								<Text fontSize={{ base: "xs", md: "sm" }} color="gray.300" lineHeight="1.6">
									{item}
								</Text>
							</HStack>
						))}
					</VStack>
				</VStack>
			),
		},
		{
			title: "Komforna vila",
			content: (
				<VStack spacing={{ base: 2, md: 4 }} align="stretch">
					<Text fontSize={{ base: "xs", md: "sm", lg: "md" }} color="gray.300" lineHeight={{ base: "1.6", md: "1.7", lg: "1.8" }} mb={{ base: 2, md: 3 }}>
						Vila je klimatizovana i pažljivo uređena kako bi pružila osećaj doma i ekskluzivnosti. Gostima su na raspolaganju:
					</Text>
					<Box bg="blackAlpha.400" borderRadius="lg" p={{ base: 4, md: 6 }}>
						<SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 3, md: 4 }} w="100%">
						{[
							"dve kompletno uređene spavaće sobe",
							"prostran dnevni boravak sa flat-screen TV-om i satelitskim kanalima",
							"moderno opremljena kuhinja sa frižiderom i trpezarijom",
							"kompletna posteljina i peškiri",
						].map((item, i) => (
							<HStack key={i} align="flex-start" spacing={{ base: 2, md: 3 }}>
								<Icon as={FiCheck} color="yellow.400" boxSize={{ base: 3.5, md: 4, lg: 5 }} mt={1} flexShrink={0} />
								<Text fontSize={{ base: "xs", md: "sm", lg: "md" }} color="gray.300" lineHeight={{ base: "1.5", md: "1.6", lg: "1.7" }}>
									{item}
								</Text>
							</HStack>
						))}
					</SimpleGrid>
					</Box>
				</VStack>
			),
		},
		{
			title: "Parking i lokacija",
			content: (
				<VStack spacing={{ base: 2, md: 4 }} align="stretch">
					<Text fontSize={{ base: "xs", md: "sm", lg: "md" }} color="gray.300" lineHeight={{ base: "1.6", md: "1.7", lg: "1.8" }}>
						Za vaše vozilo obezbeđen je besplatan privatni parking, dok se centar grada nalazi svega nekoliko minuta vožnje – Trg republike udaljen je 5,3 km, a Hram Svetog Save 6,4 km. Aerodrom „Nikola Tesla" nalazi se na 19 km od objekta.
					</Text>
					<Box 
						bg="gray.800" 
						borderLeft={{ base: "2px solid", md: "3px solid" }}
						borderColor="yellow.400" 
						p={{ base: 2.5, md: 4, lg: 5 }} 
						w="100%"
						borderRadius={{ base: "none", md: "none" }}
					>
						<Text 
							fontSize={{ base: "xs", md: "sm", lg: "md" }} 
							color="white" 
							fontWeight="300" 
							lineHeight={{ base: "1.5", md: "1.6", lg: "1.7" }} 
							fontStyle="italic"
							px={{ base: 0, md: 0 }}
						>
							✨ Belgrade River House – mesto gde se luksuz, udobnost i pogled na reku spajaju u nezaboravno iskustvo.
						</Text>
					</Box>
				</VStack>
			),
		},
		{
			title: "Savršena lokacija",
			content: (
				<VStack spacing={{ base: 2, md: 4 }} align="stretch">
					<Heading as="h3" fontSize={{ base: "md", md: "lg", lg: "xl" }} fontWeight="400" color="white" mb={{ base: 2, md: 3 }}>
						📍 Savršena lokacija
					</Heading>
					<VStack spacing={{ base: 1.5, md: 2 }} align="flex-start" pl={{ base: 0, md: 4 }}>
						<HStack spacing={{ base: 2, md: 3 }} align="flex-start">
							<Icon as={FiMapPin} color="yellow.400" boxSize={{ base: 3.5, md: 4, lg: 5 }} mt={1} flexShrink={0} />
							<Text fontSize={{ base: "xs", md: "sm", lg: "md" }} color="gray.300" lineHeight={{ base: "1.5", md: "1.6", lg: "1.7" }}>
								Trg republike je udaljen 5,3 km
							</Text>
						</HStack>
						<HStack spacing={{ base: 2, md: 3 }} align="flex-start">
							<Icon as={FiMapPin} color="yellow.400" boxSize={{ base: 3.5, md: 4, lg: 5 }} mt={1} flexShrink={0} />
							<Text fontSize={{ base: "xs", md: "sm", lg: "md" }} color="gray.300" lineHeight={{ base: "1.5", md: "1.6", lg: "1.7" }}>
								Hram Svetog Save je udaljen 6,4 km
							</Text>
						</HStack>
						<HStack spacing={{ base: 2, md: 3 }} align="flex-start">
							<Icon as={FiMapPin} color="yellow.400" boxSize={{ base: 3.5, md: 4, lg: 5 }} mt={1} flexShrink={0} />
							<Text fontSize={{ base: "xs", md: "sm", lg: "md" }} color="gray.300" lineHeight={{ base: "1.5", md: "1.6", lg: "1.7" }}>
								Aerodrom Nikola Tesla nalazi se na samo 19 km
							</Text>
						</HStack>
					</VStack>
				</VStack>
			),
		},
		{
			title: "Iskustvo koje se pamti",
			content: (
				<VStack spacing={{ base: 3, md: 4 }} align="stretch">
					<Box
						bg="rgba(255,255,255,0.04)"
						borderRadius="xl"
						p={{ base: 3, md: 4 }}
						border="1px solid"
						borderColor="rgba(255,255,255,0.08)"
					>
						<Text fontSize={{ base: "xs", md: "sm" }} color="gray.300" lineHeight="1.7">
							Opustite se u privatnom bazenu, uronite u saunu ili hidromasažnu kadu i dopustite panoramskom pogledu da vas potpuno odvoji od svakodnevice.
						</Text>
					</Box>
					<Box
						bg="blackAlpha.400"
						borderRadius="lg"
						p={{ base: 3, md: 4 }}
						boxShadow="inset 0 0 30px rgba(0,0,0,0.3)"
					>
						<Text fontSize={{ base: "xs", md: "sm" }} color="gray.200" lineHeight="1.7" textAlign="center">
							Za posao, romantični beg ili posebnu proslavu – River House donosi mir, privatnost i boutique udobnost u intimnom formatu.
						</Text>
					</Box>
					<Box
						bg="gray.800"
						border="1px solid"
						borderColor="yellow.500"
						p={{ base: 2.5, md: 4 }}
						borderRadius="lg"
					>
						<Text
							fontSize={{ base: "xs", md: "sm" }}
							color="white"
							fontWeight="500"
							lineHeight="1.6"
							textAlign="center"
							fontStyle="italic"
							letterSpacing="0.02em"
						>
							Belgrade River House – gde se luksuz susreće sa spokojem, a Beograd pokazuje svoje najlepše lice.
						</Text>
					</Box>
				</VStack>
			),
		},
	];

	// Auto-slide na svakih 7 sekundi
	useEffect(() => {
		if (slides.length <= 1 || isPaused || isTouch) return;
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 7000);
		return () => clearInterval(interval);
	}, [slides.length, isPaused, isTouch]);

	const handleSlideChange = (newSlide: number) => {
		if (newSlide < 0 || newSlide >= slides.length) return;
		setIsPaused(true);
		setCurrentSlide(newSlide);
		setTimeout(() => setIsPaused(false), 7000);
	};

	const handlePrev = () => {
		const newSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
		handleSlideChange(newSlide);
	};

	const handleNext = () => {
		const newSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
		handleSlideChange(newSlide);
	};

	return (
		<Box id="o-nama" py={{ base: 12, md: 20, lg: 24 }} bg="black">
			<Container maxW="container.xl" px={{ base: 4, md: 6, lg: 8 }}>
				<VStack spacing={{ base: 6, md: 8 }}>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						style={{ width: "100%" }}
					>
						<Text
							fontSize={{ base: "xs", md: "sm" }}
							color="gray.500"
							letterSpacing={{ base: "0.15em", md: "0.2em" }}
							textTransform="uppercase"
							textAlign="center"
							mb={{ base: 3, md: 4 }}
						>
							O nama
						</Text>
						<Heading
							as="h2"
							fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
							fontWeight="300"
							letterSpacing={{ base: "-0.01em", md: "-0.02em" }}
							textAlign="center"
							color="white"
							px={{ base: 2, md: 0 }}
							mb={{ base: 6, md: 8 }}
						>
							Luksuzni mir uz reku
						</Heading>
					</motion.div>

					<Box
						w="100%"
						maxW="900px"
						mx="auto"
						position="relative"
						onMouseEnter={() => setIsPaused(true)}
						onMouseLeave={() => setIsPaused(false)}
					>
						{/* Navigation arrows */}
						{slides.length > 1 && !isTouch && (
							<>
								<IconButton
									aria-label="Prethodni slajd"
									icon={<FiArrowRight style={{ transform: "rotate(180deg)" }} />}
									position="absolute"
									left={{ base: 2, md: -12 }}
									top="50%"
									transform="translateY(-50%)"
									zIndex={3}
									bg="gray.900"
									color="yellow.400"
									borderWidth="1px"
									borderColor="yellow.400"
									borderRadius="full"
									_hover={{ bg: "yellow.400", color: "black" }}
									onClick={handlePrev}
									display={{ base: "none", md: "flex" }}
								/>
								<IconButton
									aria-label="Sledeći slajd"
									icon={<FiArrowRight />}
									position="absolute"
									right={{ base: 2, md: -12 }}
									top="50%"
									transform="translateY(-50%)"
									zIndex={3}
									bg="gray.900"
									color="yellow.400"
									borderWidth="1px"
									borderColor="yellow.400"
									borderRadius="full"
									_hover={{ bg: "yellow.400", color: "black" }}
									onClick={handleNext}
									display={{ base: "none", md: "flex" }}
								/>
							</>
						)}

						{isTouch ? (
							<MobileSnapCarousel
								cardWidth="90%"
								items={slides.map((slide, idx) => (
										<Card
										key={idx}
											bg="gray.900"
											borderWidth="1px"
										borderColor="gray.800"
										borderRadius="lg"
										p={6}
										minH={{ base: "420px", md: "auto" }}
										display="flex"
									>
										<VStack spacing={4} align="stretch" h="100%">
												<Heading as="h3" fontSize="lg" fontWeight="500" color="white">
													{slide.title}
												</Heading>
												{slide.content}
											</VStack>
										</Card>
								))}
							/>
						) : (
							<>
						{/* Desktop fade in/out container */}
								<Box position="relative" w="100%" h="350px">
							{slides.map((slide, idx) => (
								<motion.div
									key={idx}
									initial={false}
									animate={{
										opacity: currentSlide === idx ? 1 : 0,
										scale: currentSlide === idx ? 1 : 0.96,
										y: currentSlide === idx ? 0 : 15,
									}}
									transition={{
										duration: 0.7,
										ease: "easeInOut",
									}}
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										width: "100%",
										height: "100%",
										pointerEvents: currentSlide === idx ? "auto" : "none",
									}}
								>
									<Card
										bg="gray.900"
										borderWidth="1px"
										borderColor={currentSlide === idx ? "yellow.400" : "gray.800"}
										borderRadius="none"
										p={8}
										w="100%"
										h="100%"
										_hover={{
											borderColor: "yellow.400",
										}}
										transition="all 0.3s ease"
									>
										<VStack spacing={5} align="stretch" h="100%" justify="flex-start">
											<motion.div
												initial={{ opacity: 0, y: 15 }}
												animate={{
													opacity: currentSlide === idx ? 1 : 0,
													y: currentSlide === idx ? 0 : 15,
												}}
												transition={{ delay: 0.15, duration: 0.5 }}
											>
												<Heading
													as="h3"
													fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
													fontWeight="400"
													color="white"
													textAlign="center"
													mb={5}
													px={0}
												>
													{slide.title}
												</Heading>
											</motion.div>
											<motion.div
												initial={{ opacity: 0 }}
												animate={{
													opacity: currentSlide === idx ? 1 : 0,
												}}
												transition={{ delay: 0.3, duration: 0.5 }}
											>
												{slide.content}
											</motion.div>
										</VStack>
									</Card>
								</motion.div>
							))}
						</Box>

						{/* Navigation dots */}
						{slides.length > 1 && (
							<HStack spacing={2} justify="center" mt={{ base: 6, md: 8 }}>
								{slides.map((_, idx) => (
									<Box
										key={idx}
										w={currentSlide === idx ? "32px" : "8px"}
										h="8px"
										bg={currentSlide === idx ? "yellow.400" : "gray.600"}
										borderRadius="full"
										cursor="pointer"
										onClick={() => handleSlideChange(idx)}
										transition="all 0.3s ease"
										sx={{ touchAction: "manipulation" }}
									/>
								))}
							</HStack>
								)}
							</>
						)}
					</Box>
				</VStack>
			</Container>
		</Box>
	);
};

const GallerySection: React.FC<{ images: string[] }> = ({ images }) => {
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
					{!images || images.length === 0 ? (
						<Box textAlign="center" py={12}>
							<Text fontSize="lg" color="gray.500">
								Trenutno nema slika u galeriji.
							</Text>
						</Box>
					) : (
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
					)}
				</VStack>
			</Container>
		</Box>
	);
};

type Review = {
	_id: string;
	authorName: string;
	rating: number;
	text: string;
	imageUrl?: string;
	featured?: boolean;
	createdAt?: string;
};

const GoogleReviewsSection: React.FC = () => {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [formData, setFormData] = useState({
		authorName: "",
		rating: 5,
		text: "",
		imageUrl: "",
	});
	const [uploadingImage, setUploadingImage] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [isPaused, setIsPaused] = useState(false);
	const isTouch = useBreakpointValue({ base: true, md: false });

	useEffect(() => {
		const loadReviews = async () => {
			try {
				const res = await fetch("/api/reviews", { cache: "no-store" });
				const data = await res.json();
				if (Array.isArray(data)) {
					setReviews(data);
				}
			} catch (error) {
				console.error("Failed to load reviews:", error);
			} finally {
				setLoading(false);
			}
		};
		loadReviews();
	}, []);

	// Auto-slide za slider - menjanje na 3 sekunde
	useEffect(() => {
		if (reviews.length <= 1 || isPaused || isTouch) return;
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % reviews.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [reviews.length, isPaused, isTouch]);

	const handleSlideChange = (newSlide: number) => {
		if (newSlide < 0 || newSlide >= reviews.length) return;
		setIsPaused(true);
		setCurrentSlide(newSlide);
		setTimeout(() => setIsPaused(false), 3000);
	};

	const handlePrev = () => {
		const newSlide = currentSlide === 0 ? reviews.length - 1 : currentSlide - 1;
		handleSlideChange(newSlide);
	};

	const handleNext = () => {
		const newSlide = currentSlide === reviews.length - 1 ? 0 : currentSlide + 1;
		handleSlideChange(newSlide);
	};



	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Provera tipa fajla
		if (!file.type.startsWith("image/")) {
			alert("Molimo izaberite sliku.");
			return;
		}

		// Provera veličine (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			alert("Slika mora biti manja od 5MB.");
			return;
		}

		setUploadingImage(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("/api/reviews/upload", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.error || "Greška pri upload-u slike");
			}

			const data = await res.json();
			setFormData((prev) => ({ ...prev, imageUrl: data.url }));
			setImagePreview(data.url);
		} catch (error: any) {
			console.error("Upload error:", error);
			alert(error?.message || "Greška pri upload-u slike");
		} finally {
			setUploadingImage(false);
		}
	};

	const removeImage = () => {
		setFormData((prev) => ({ ...prev, imageUrl: "" }));
		setImagePreview(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setSubmitSuccess(false);

		try {
			const res = await fetch("/api/reviews", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					authorName: formData.authorName,
					rating: formData.rating,
					text: formData.text,
					imageUrl: formData.imageUrl || undefined,
				}),
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.error || "Greška pri slanju recenzije");
			}

			setSubmitSuccess(true);
			setFormData({ authorName: "", rating: 5, text: "", imageUrl: "" });
			setImagePreview(null);
			
			// Reload reviews
			const resReviews = await fetch("/api/reviews", { cache: "no-store" });
			const data = await resReviews.json();
			if (Array.isArray(data)) {
				setReviews(data);
			}

			setTimeout(() => setSubmitSuccess(false), 5000);
		} catch (error: any) {
			console.error("Failed to submit review:", error);
			alert(error?.message || "Greška pri slanju recenzije");
		} finally {
			setSubmitting(false);
		}
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		
		if (diffDays === 1) return "Pre 1 dan";
		if (diffDays < 7) return `Pre ${diffDays} dana`;
		if (diffDays < 30) return `Pre ${Math.floor(diffDays / 7)} nedelja`;
		return `Pre ${Math.floor(diffDays / 30)} meseci`;
	};

	return (
		<Box id="recenzije" py={{ base: 16, md: 32 }} bg="black">
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
							Recenzije
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
							Šta kažu naši gosti
						</Heading>
					</motion.div>

					{/* Forma za ostavljanje recenzije */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}
					>
						<Card bg="gray.900" borderWidth="1px" borderColor="gray.800" borderRadius="none" p={{ base: 6, md: 8 }}>
							<VStack spacing={6} align="stretch">
								<Heading size="md" color="white" textAlign="center">
									Ostavi recenziju
								</Heading>
								<form onSubmit={handleSubmit}>
									<VStack spacing={4}>
										<Input
											placeholder="Tvoje ime"
											value={formData.authorName}
											onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
											required
											bg="black"
											borderColor="gray.700"
											color="white"
											borderRadius="none"
											_placeholder={{ color: "gray.500" }}
											_focus={{ borderColor: "yellow.400" }}
										/>
										<Box w="100%">
											<Text mb={2} color="gray.400" fontSize="sm">
												Ocena:
											</Text>
											<HStack spacing={2} justify="center">
												{Array.from({ length: 5 }).map((_, i) => (
													<Box
														key={i}
														as="button"
														type="button"
														onClick={() => setFormData({ ...formData, rating: i + 1 })}
														cursor="pointer"
														transition="all 0.2s ease"
														_hover={{ transform: "scale(1.2)" }}
														_active={{ transform: "scale(0.95)" }}
														aria-label={`Ocena ${i + 1}`}
														bg="transparent"
														border="none"
														p={0}
														display="flex"
														alignItems="center"
														justifyContent="center"
													>
														{i < formData.rating ? (
															<Icon
																as={AiFillStar}
																boxSize={8}
																color="yellow.400"
															/>
														) : (
															<Icon
																as={AiOutlineStar}
																boxSize={8}
																color="gray.600"
															/>
														)}
													</Box>
												))}
											</HStack>
										</Box>
										<Input
											as="textarea"
											placeholder="Tvoja recenzija..."
											value={formData.text}
											onChange={(e) => setFormData({ ...formData, text: e.target.value })}
											required
											rows={4}
											bg="black"
											borderColor="gray.700"
											color="white"
											borderRadius="none"
											_placeholder={{ color: "gray.500" }}
											_focus={{ borderColor: "yellow.400" }}
										/>
										<Box w="100%">
											<Text mb={2} color="gray.400" fontSize="sm">
												Slika profila (opciono):
											</Text>
											{imagePreview ? (
												<Box position="relative" w="100px" h="100px" mb={2}>
													<SafeImage
														src={imagePreview}
														alt="Preview"
														width={100}
														height={100}
														style={{
															width: "100%",
															height: "100%",
															objectFit: "cover",
															borderRadius: "50%",
														}}
													/>
													<IconButton
														aria-label="Ukloni sliku"
														icon={<FiX />}
														size="sm"
														position="absolute"
														top={-2}
														right={-2}
														bg="red.500"
														color="white"
														borderRadius="full"
														onClick={removeImage}
														_hover={{ bg: "red.600" }}
													/>
												</Box>
											) : (
												<Box
													as="label"
													cursor="pointer"
													borderWidth="2px"
													borderStyle="dashed"
													borderColor="gray.600"
													borderRadius="md"
													p={4}
													display="flex"
													flexDirection="column"
													alignItems="center"
													justifyContent="center"
													gap={2}
													bg="black"
													transition="all 0.2s"
													_hover={{
														borderColor: "yellow.400",
														bg: "gray.900",
													}}
												>
													<input
														type="file"
														accept="image/*"
														onChange={handleImageUpload}
														style={{ display: "none" }}
														disabled={uploadingImage}
													/>
													{uploadingImage ? (
														<>
															<Spinner size="md" color="yellow.400" />
															<Text fontSize="sm" color="gray.400">
																Uploadujem...
															</Text>
														</>
													) : (
														<>
															<Icon as={FiUpload} boxSize={6} color="gray.400" />
															<Text fontSize="sm" color="gray.400" textAlign="center">
																Klikni da izabereš sliku
															</Text>
															<Text fontSize="xs" color="gray.500" textAlign="center">
																Max 5MB
															</Text>
														</>
													)}
												</Box>
											)}
										</Box>
										{submitSuccess && (
											<Box bg="green.900" color="green.200" p={3} borderRadius="md" w="100%" textAlign="center">
												Hvala! Tvoja recenzija je uspešno poslata.
											</Box>
										)}
										<Button
											type="submit"
											colorScheme="yellow"
											size="lg"
											w="100%"
											borderRadius="none"
											isLoading={submitting}
											rightIcon={<FiArrowRight />}
											_hover={{ bg: "yellow.500" }}
										>
											Pošalji recenziju
										</Button>
									</VStack>
								</form>
							</VStack>
						</Card>
					</motion.div>

					{/* Slider za prethodne recenzije */}
					{loading ? (
						<Flex justify="center" py={12}>
							<Spinner size="xl" color="yellow.400" />
						</Flex>
					) : reviews.length === 0 ? (
						<Box textAlign="center" py={12}>
							<Text fontSize="lg" color="gray.500">
								Trenutno nema dostupnih recenzija. Budi prvi koji će ostaviti recenziju!
							</Text>
						</Box>
					) : isTouch ? (
						<Box w="100%">
							<MobileSnapCarousel
								cardWidth="90%"
								items={reviews.map((review) => (
									<Card
										key={review._id}
										bg="gray.900"
										borderWidth="1px"
										borderColor="gray.800"
										borderRadius="lg"
										p={4}
									>
										<VStack spacing={3} align="stretch">
											<HStack align="start" spacing={3}>
												{review.imageUrl ? (
													<Box
														w="50px"
														h="50px"
														borderRadius="full"
														overflow="hidden"
														borderWidth="2px"
														borderColor="yellow.400"
													>
														<SafeImage
															src={review.imageUrl}
															alt={review.authorName}
															width={50}
															height={50}
															style={{ width: "100%", height: "100%", objectFit: "cover" }}
														/>
													</Box>
												) : (
													<Box
														w="50px"
														h="50px"
														borderRadius="full"
														bg="yellow.400"
														display="flex"
														alignItems="center"
														justifyContent="center"
														fontWeight="bold"
														color="black"
													>
														{review.authorName.charAt(0).toUpperCase()}
													</Box>
												)}
												<VStack align="start" spacing={1}>
													<Text fontWeight="600" color="white">
														{review.authorName}
													</Text>
													<HStack spacing={1}>
														{Array.from({ length: 5 }).map((_, i) => (
															<Icon
																key={i}
																as={i < review.rating ? AiFillStar : AiOutlineStar}
																color={i < review.rating ? "yellow.400" : "gray.600"}
																boxSize={4}
															/>
														))}
													</HStack>
												</VStack>
											</HStack>
											<Text color="gray.300" fontSize="sm" lineHeight="1.6" fontStyle="italic">
												"{review.text}"
											</Text>
											{review.createdAt && (
												<Text color="gray.500" fontSize="xs">
													{formatDate(review.createdAt)}
												</Text>
											)}
										</VStack>
									</Card>
								))}
							/>
						</Box>
					) : (
						<Box 
							w="100%" 
							maxW="900px" 
							mx="auto" 
							position="relative"
							px={{ base: 0, md: 16 }}
							onMouseEnter={() => setIsPaused(true)}
							onMouseLeave={() => setIsPaused(false)}
						>
							{/* Navigation arrows */}
							{reviews.length > 1 && (
								<>
									<IconButton
										aria-label="Prethodna recenzija"
										icon={<FiArrowRight style={{ transform: "rotate(180deg)" }} />}
										position="absolute"
										left={{ base: 2, md: 0 }}
										top="50%"
										transform="translateY(-50%)"
										zIndex={3}
										bg="gray.900"
										color="yellow.400"
										borderWidth="1px"
										borderColor="yellow.400"
										borderRadius="full"
										_hover={{ bg: "yellow.400", color: "black" }}
										onClick={handlePrev}
										display={{ base: "none", md: "flex" }}
									/>
									<IconButton
										aria-label="Sledeća recenzija"
										icon={<FiArrowRight />}
										position="absolute"
										right={{ base: 2, md: 0 }}
										top="50%"
										transform="translateY(-50%)"
										zIndex={3}
										bg="gray.900"
										color="yellow.400"
										borderWidth="1px"
										borderColor="yellow.400"
										borderRadius="full"
										_hover={{ bg: "yellow.400", color: "black" }}
										onClick={handleNext}
										display={{ base: "none", md: "flex" }}
									/>
								</>
							)}
							
							<Box 
								overflow="hidden" 
								borderRadius="none"
								position="relative"
								w="100%"
							>
								<Flex
									w={`${reviews.length * 100}%`}
									style={{
										transform: `translateX(-${currentSlide * (100 / reviews.length)}%)`,
										transition: "transform 0.5s ease-in-out",
										display: "flex",
									}}
								>
									{reviews.map((review) => (
										<Box 
											key={review._id} 
											w={`${100 / reviews.length}%`}
											flexShrink={0}
											px={{ base: 2, md: 4 }}
										>
											<Card
												bg="gray.900"
												borderWidth="1px"
												borderColor="gray.800"
												borderRadius="none"
												p={4}
												w="100%"
												_hover={{
													borderColor: "yellow.400",
												}}
												transition="all 0.3s ease"
											>
												<VStack spacing={3} align="stretch" w="100%">
													<HStack justify="flex-start" align="start" spacing={3} flexWrap="wrap">
														{review.imageUrl ? (
															<Box
																w="50px"
																h="50px"
																borderRadius="full"
																overflow="hidden"
																flexShrink={0}
																borderWidth="2px"
																borderColor="yellow.400"
															>
																<SafeImage
																	src={review.imageUrl}
																	alt={review.authorName}
																	width={50}
																	height={50}
																	style={{
																		width: "100%",
																		height: "100%",
																		objectFit: "cover",
																	}}
																/>
															</Box>
														) : (
															<Box
																w="50px"
																h="50px"
																borderRadius="full"
																bg="yellow.400"
																display="flex"
																alignItems="center"
																justifyContent="center"
																flexShrink={0}
																fontWeight="bold"
																fontSize="lg"
																color="black"
															>
																{review.authorName.charAt(0).toUpperCase()}
															</Box>
														)}
														<VStack align="start" spacing={1} flex="1">
															<Text fontWeight="600" color="white" fontSize="md">
																{review.authorName}
															</Text>
															<HStack spacing={1}>
																{Array.from({ length: 5 }).map((_, i) => (
																	<Icon
																		key={i}
																		as={i < review.rating ? AiFillStar : AiOutlineStar}
																		color={i < review.rating ? "yellow.400" : "gray.600"}
																		boxSize={4}
																	/>
																))}
															</HStack>
														</VStack>
													</HStack>
													<Box w="100%">
														<Text 
															color="gray.300" 
															fontSize="sm" 
															lineHeight="1.6" 
															fontStyle="italic" 
															wordBreak="break-word"
														>
															"{review.text}"
														</Text>
													</Box>
													{review.createdAt && (
														<Text color="gray.500" fontSize="xs">
															{formatDate(review.createdAt)}
														</Text>
													)}
												</VStack>
											</Card>
										</Box>
									))}
								</Flex>
							</Box>
							
							{/* Navigation dots */}
							{reviews.length > 1 && (
								<HStack spacing={2} justify="center" mt={6}>
									{reviews.map((_, idx) => (
										<Box
											key={idx}
											w={currentSlide === idx ? "24px" : "8px"}
											h="8px"
											bg={currentSlide === idx ? "yellow.400" : "gray.600"}
											borderRadius="full"
											cursor="pointer"
											onClick={() => handleSlideChange(idx)}
											transition="all 0.3s ease"
										/>
									))}
								</HStack>
							)}
						</Box>
					)}
				</VStack>
			</Container>
		</Box>
	);
};

const BookingSection = () => {
	return (
		<Box id="booking" py={{ base: 16, md: 24 }} bg="black">
			<Container maxW="container.xl" px={{ base: 4, md: 8 }}>
				<VStack spacing={{ base: 8, md: 10 }}>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						style={{ width: "100%" }}
					>
						<Text
							fontSize={{ base: "xs", md: "sm" }}
							color="gray.500"
							letterSpacing={{ base: "0.15em", md: "0.2em" }}
							textTransform="uppercase"
							textAlign="center"
							mb={{ base: 3, md: 4 }}
						>
							Booking ponuda
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
							Belgrade River House na Booking.com
						</Heading>
					</motion.div>

					<SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 6, md: 8 }} w="100%">
						<Card bg="gray.900" borderWidth="1px" borderColor="gray.800" borderRadius="none" p={{ base: 6, md: 8 }}>
							<VStack align="flex-start" spacing={4}>
								<Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} color="white" fontWeight="400">
									Zašto rezervisati preko Booking-a?
								</Heading>
								<Text color="gray.300" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
									Naš zvanični Booking.com oglas pruža transparentan uvid u cene, dostupnost i utiske gostiju, uz sigurnu i
									brzu rezervaciju. Idealno za sve koji žele instant potvrdu i podršku 24/7.
								</Text>
								<VStack align="stretch" spacing={3} w="100%">
									<HStack spacing={3} align="flex-start">
										<Icon as={FiStar} color="yellow.400" boxSize={5} mt={1} />
										<Text color="gray.300" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
											Autentične ocene i komentari potvrđenih gostiju.
										</Text>
									</HStack>
									<HStack spacing={3} align="flex-start">
										<Icon as={FiHome} color="yellow.400" boxSize={5} mt={1} />
										<Text color="gray.300" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
											Precizne informacije o sadržajima vile i sezonskim pogodnostima.
										</Text>
									</HStack>
								</VStack>
							</VStack>
						</Card>
						<Card bg="gray.900" borderWidth="1px" borderColor="gray.800" borderRadius="none" p={{ base: 6, md: 8 }}>
							<VStack align="flex-start" spacing={4}>
								<Heading as="h3" fontSize={{ base: "xl", md: "2xl" }} color="white" fontWeight="400">
									Adresa i lokacija
								</Heading>
								<Text color="gray.300" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
									Belgrade River House se nalazi u mirnom delu Palilule, na adresi Zapadnomoravska 46a – savršena pozicija
									uz reku, svega nekoliko minuta od centra Beograda.
								</Text>
								<Box w="100%" borderLeft="3px solid" borderColor="yellow.400" bg="gray.800" p={{ base: 4, md: 5 }}>
									<HStack spacing={3} align="flex-start">
										<Icon as={FiMapPin} color="yellow.400" boxSize={5} mt={1} />
										<VStack align="flex-start" spacing={1} w="100%">
											<Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="500">
												Zapadnomoravska 46a, Palilula
											</Text>
											<Text color="gray.300" fontSize={{ base: "sm", md: "md" }}>
												Privatni prilaz, parking i terasa na samoj obali pružaju ekskluzivno iskustvo boravka.
											</Text>
										</VStack>
									</HStack>
								</Box>
							</VStack>
						</Card>
					</SimpleGrid>

					<Button
						as="a"
						href="https://www.booking.com/hotel/rs/belgrade-river-house.sr.html?aid=356980&label=gog235jc-10CAsowQFCFGJlbGdyYWRlLXJpdmVyLWhvdXNlSCRYA2jBAYgBAZgBM7gBF8gBDNgBA-gBAfgBAYgCAagCAbgCldLbyAbAAgHSAiQ1ZWJhYjNlMy03NmVkLTQ5ZjAtOTA0OS01ZjViYTc0OTdjMzLYAgHgAgE&sid=8b17b64546e8e62162533a4a6ef0474a&age=5&age=7&dest_id=-74897&dest_type=city&dist=0&group_adults=2&group_children=2&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_age=5&req_age=7&req_children=2&room1=A%2CA%2C5%2C7&sb_price_type=total&sr_order=popularity&srepoch=1763109148&srpvid=60e33c0ba552016c&type=total&ucfs=1&"
						target="_blank"
						rel="noopener noreferrer"
						size="lg"
						w={{ base: "100%", md: "auto" }}
						px={{ base: 10, md: 12 }}
						py={{ base: 6, md: 7 }}
						fontSize={{ base: "md", md: "lg" }}
						fontWeight="500"
						borderRadius="none"
						bg="white"
						color="black"
						textTransform="uppercase"
						rightIcon={<FiArrowRight />}
						_hover={{ bg: "gray.100", transform: "translateY(-2px)" }}
						transition="all 0.3s ease"
					>
						Otvori Booking ponudu
					</Button>
				</VStack>
			</Container>
		</Box>
	);
};

const INSTAGRAM_FALLBACK_IMAGES = [
	"https://res.cloudinary.com/dvohrn0zf/image/upload/v1762958941/river-house-belgrade/sfe2udeyuprvxhrvnoc5.jpg",
];

const InstagramSection: React.FC<{ images: string[] }> = ({ images }) => {
	const slides = useMemo(() => {
		return images && images.length > 0 ? images : INSTAGRAM_FALLBACK_IMAGES;
	}, [images]);
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		setActiveIndex(0);
	}, [slides]);

	useEffect(() => {
		if (slides.length <= 1) return;
		const interval = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % slides.length);
		}, 3000);
		return () => clearInterval(interval);
	}, [slides]);

	const currentImage = slides[activeIndex] || slides[0];

	return (
		<Box id="instagram" py={{ base: 16, md: 24 }} bg="black">
			<Container maxW="container.xl" px={{ base: 4, md: 8 }}>
				<VStack spacing={{ base: 8, md: 12 }}>
					<motion.div
						initial={{ opacity: 0, y: 25 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						style={{ width: "100%" }}
					>
						<Text
							fontSize={{ base: "xs", md: "sm" }}
							color="gray.500"
							letterSpacing={{ base: "0.15em", md: "0.2em" }}
							textTransform="uppercase"
							textAlign="center"
							mb={{ base: 3, md: 4 }}
						>
							Instagram
						</Text>
						<Heading
							as="h2"
							fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
							fontWeight="300"
							textAlign="center"
							color="white"
							px={{ base: 2, md: 0 }}
						>
							Živi tok sa reke
						</Heading>
						<Text
							textAlign="center"
							color="gray.400"
							fontSize={{ base: "md", md: "lg" }}
							mt={4}
							maxW="720px"
							mx="auto"
						>
							Pogledaj najnovije trenutke sa terase, bazena i rečne obale. Instagram feed beleži svaku zoru i glamurozno veče na vodi.
						</Text>
					</motion.div>

					<SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, lg: 10 }} w="100%" alignItems="stretch">
						<Card bg="gray.900" borderWidth="1px" borderColor="gray.800" borderRadius="xl" p={{ base: 6, md: 8 }}>
							<VStack align="flex-start" spacing={{ base: 4, md: 6 }}>
								<Tag colorScheme="yellow" size="lg" borderRadius="full">
									@belgraderiverhouse
								</Tag>
								<Heading as="h3" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="400" color="white">
									Podeli svoj river vibe
								</Heading>
								<Text color="gray.300" fontSize={{ base: "sm", md: "md" }} lineHeight="1.8">
									Instagram profil otkriva realne prizore – od prvog gutljaja espresso kafe na pontonu do večernjeg šampanjca uz gradsku panoramu.
								</Text>
								<VStack align="stretch" spacing={3}>
									{[
										"Rezne priče u Stories formatu: iza kulisa pripreme bazena i privatnih događaja.",
										"Carousel objave sa detaljima enterijera i novih setup-a za proslave.",
										"Reels klipovi koji hvataju vibe noćenja na vodi.",
									].map((item, idx) => (
										<HStack key={idx} spacing={3} align="flex-start">
											<Icon as={FiStar} color="yellow.400" mt={1} />
											<Text color="gray.300" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">
												{item}
											</Text>
										</HStack>
									))}
								</VStack>
								<Button
									as="a"
									href="https://www.instagram.com/belgrade.river.house/?igsh=cHk2Nnhsa3AyZDg0#"
									target="_blank"
									rel="noopener noreferrer"
									size="lg"
									borderRadius="none"
									bg="white"
									color="black"
									textTransform="uppercase"
									rightIcon={<FiArrowRight />}
									px={{ base: 8, md: 10 }}
									py={{ base: 5, md: 6 }}
									_hover={{ bg: "gray.100", transform: "translateY(-2px)" }}
								>
									Prati na Instagramu
								</Button>
							</VStack>
						</Card>

						<Card
							bg="black"
							borderWidth="1px"
							borderColor="gray.800"
							borderRadius="xl"
							overflow="hidden"
							position="relative"
							p={0}
							minH={{ base: "320px", md: "420px" }}
						>
							<Box position="relative" w="100%" h="100%">
								<AnimatePresence mode="wait">
									<motion.div
										key={currentImage}
										initial={{ opacity: 0, scale: 1.03 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.97 }}
										transition={{ duration: 0.6, ease: "easeInOut" }}
										style={{ width: "100%", height: "100%" }}
									>
										<SafeImage
											src={currentImage}
											alt="Instagram Belgrade River House"
											width={900}
											height={900}
											style={{ width: "100%", height: "100%", objectFit: "cover" }}
										/>
									</motion.div>
								</AnimatePresence>
								<Box
									position="absolute"
									inset={0}
									bg="linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)"
								/>
								<VStack
									position="absolute"
									bottom={0}
									left={0}
									right={0}
									p={{ base: 4, md: 6 }}
									align="flex-start"
									spacing={2}
								>
									<Text fontSize={{ base: "lg", md: "xl" }} fontWeight="500">
										River House trenutak
									</Text>
									<Text fontSize={{ base: "sm", md: "md" }} color="gray.200" lineHeight="1.6">
										Zaprati profil i uhvati prve informacije o event setup-ovima, dekor update-ima i river brunch izdanjima.
									</Text>
									{slides.length > 1 && (
										<HStack spacing={2} pt={2}>
											{slides.map((_, idx) => (
												<Box
													key={idx}
													w={activeIndex === idx ? "20px" : "8px"}
													h="8px"
													bg={activeIndex === idx ? "yellow.400" : "gray.500"}
													borderRadius="full"
													cursor="pointer"
													onClick={() => setActiveIndex(idx)}
													transition="all 0.2s"
												/>
											))}
										</HStack>
									)}
								</VStack>
							</Box>
						</Card>
					</SimpleGrid>
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
								Rezervacije
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
