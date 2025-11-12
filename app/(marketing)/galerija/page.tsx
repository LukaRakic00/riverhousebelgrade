"use client";

import { useEffect, useState } from "react";
import { SafeImage } from "../../../components/SafeImage";
import {
	Box,
	Container,
	Heading,
	SimpleGrid,
	Text,
	VStack,
	Spinner,
	Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

type Category = {
	_id: string;
	name: string;
	description?: string;
	imageUrls: string[];
	order: number;
};

export default function GalerijaPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadCategories = async () => {
			try {
				const res = await fetch("/api/categories", { cache: "no-store" });
				const data = await res.json();
				setCategories(data || []);
			} catch (error) {
				console.error("Error loading categories:", error);
			} finally {
				setLoading(false);
			}
		};
		loadCategories();
	}, []);

	if (loading) {
		return (
			<Box minH="100vh" bg="black" display="flex" alignItems="center" justifyContent="center">
				<Spinner size="xl" color="white" />
			</Box>
		);
	}

	return (
		<Box minH="100vh" bg="black" color="white" py={{ base: 16, md: 32 }}>
			<Container maxW="container.xl" px={{ base: 4, md: 8 }}>
				<VStack spacing={{ base: 12, md: 16 }}>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
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
							as="h1"
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

					{categories.length === 0 ? (
						<Box textAlign="center" py={12}>
							<Text fontSize="lg" color="gray.500">
								Nema kategorija u galeriji.
							</Text>
						</Box>
					) : (
						<VStack spacing={{ base: 16, md: 24 }} w="100%" align="stretch">
							{categories.map((category, catIdx) => (
								<motion.div
									key={category._id}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.6, delay: catIdx * 0.1 }}
								>
									<VStack spacing={{ base: 6, md: 8 }} align="stretch">
										<VStack spacing={2} align="start">
											<Heading
												as="h2"
												fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
												fontWeight="300"
												color="white"
											>
												{category.name}
											</Heading>
											{category.description && (
												<Text color="gray.400" fontSize={{ base: "sm", md: "md" }}>
													{category.description}
												</Text>
											)}
										</VStack>

										{category.imageUrls.length === 0 ? (
											<Text color="gray.500" fontSize="sm">
												Nema slika u ovoj kategoriji.
											</Text>
										) : (
											<PhotoProvider>
												<SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 3, md: 4 }}>
													{category.imageUrls.map((src, imgIdx) => (
														<PhotoView key={imgIdx} src={src}>
															<Box
																position="relative"
																overflow="hidden"
																borderRadius="none"
																aspectRatio={4 / 3}
																cursor="pointer"
																transition="all 0.3s ease"
																_hover={{
																	transform: { base: "none", md: "scale(1.02)" },
																}}
																_active={{
																	transform: "scale(0.98)",
																}}
															>
																<SafeImage
																	src={src}
																	alt={`${category.name} ${imgIdx + 1}`}
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
															</Box>
														</PhotoView>
													))}
												</SimpleGrid>
											</PhotoProvider>
										)}
									</VStack>
								</motion.div>
							))}
						</VStack>
					)}
				</VStack>
			</Container>
		</Box>
	);
}

