"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Container,
	Heading,
	Text,
	VStack,
	HStack,
	Card,
	CardBody,
	Spinner,
	Flex,
	SimpleGrid,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

type IncludedItemDetail = {
	icon: string;
	title: string;
	description?: string;
};

type PriceType = {
	price: number;
	description?: string;
	includedItemsDetails?: IncludedItemDetail[];
	additionalBenefits?: string;
	note?: string;
};

export default function CenovnikPage() {
	const [price, setPrice] = useState<PriceType | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadPrice = async () => {
			try {
				const res = await fetch("/api/pricing", { cache: "no-store" });
				const data = await res.json();
				setPrice(data || null);
			} catch (error) {
				console.error("Failed to load price:", error);
			} finally {
				setLoading(false);
			}
		};
		loadPrice();
	}, []);

	return (
		<Box bg="black" color="white" minH="100vh" py={{ base: 4, md: 32 }} pt={{ base: 28, md: 32 }}>
			<Container maxW="container.lg" px={{ base: 4, md: 8 }}>
				<VStack spacing={{ base: 8, md: 12 }}>
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
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
							Cenovnik
						</Text>
						<Heading
							as="h1"
							fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
							fontWeight="300"
							letterSpacing={{ base: "-0.01em", md: "-0.02em" }}
							textAlign="center"
							color="white"
							px={{ base: 2, md: 0 }}
							mb={{ base: 4, md: 6 }}
						>
							Upoznajte našu ponudu
						</Heading>
					</motion.div>

					{/* Price Card */}
					{loading ? (
						<Flex justify="center" py={12}>
							<Spinner size="xl" color="yellow.400" />
						</Flex>
					) : !price ? (
						<Box textAlign="center" py={12}>
							<Text fontSize="lg" color="gray.500">
								Trenutno nema dostupnih cena.
							</Text>
						</Box>
					) : (
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
							style={{ width: "100%" }}
						>
							<Card
								bg="gray.900"
								borderWidth="1px"
								borderColor="gray.800"
								borderRadius="none"
								_hover={{
									borderColor: "yellow.400",
									transform: "translateY(-4px)",
									boxShadow: "0 10px 40px rgba(255, 255, 0, 0.1)",
								}}
								transition="all 0.3s ease"
								maxW="900px"
								mx="auto"
							>
								<CardBody p={{ base: 6, md: 10 }}>
									<VStack spacing={8} align="stretch">
										{/* Cena */}
										<Box
											bg="blackAlpha.400"
											borderLeft="3px solid"
											borderColor="yellow.400"
											p={6}
											borderRadius="md"
										>
											<Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="0.1em" mb={2}>
												Cena
											</Text>
											<Heading
												as="h2"
												fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}
												fontWeight="300"
												color="yellow.400"
												mb={1}
											>
												{price.price.toLocaleString("sr-RS")} RSD / dan
											</Heading>
										</Box>

										{/* Opis - ako nema description, možda je u starom formatu gde je sve u jednom stringu */}
										{price.description && (
											<Text fontSize={{ base: "md", md: "lg" }} color="gray.300" lineHeight="1.7">
												{price.description}
											</Text>
										)}

										{/* Šta dobijate u okviru boravka */}
										{price.includedItemsDetails && price.includedItemsDetails.length > 0 && (
											<Box>
												<Heading 
													as="h3" 
													fontSize={{ base: "xl", md: "2xl" }} 
													fontWeight="400" 
													color="white" 
													mb={6}
												>
													Šta dobijate u okviru boravka
												</Heading>
												<VStack align="stretch" spacing={4}>
													{price.includedItemsDetails.map((item, idx) => (
														<motion.div
															key={idx}
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ duration: 0.4, delay: idx * 0.1 }}
															style={{ width: "100%" }}
														>
															<Card
																bg="gray.800"
																borderWidth="1px"
																borderColor="gray.700"
																borderRadius="none"
																p={5}
																_hover={{
																	borderColor: "yellow.400",
																	transform: "translateY(-2px)",
																}}
																transition="all 0.3s ease"
															>
																<HStack spacing={4} align="start">
																	<Text fontSize="3xl" flexShrink={0} lineHeight="1">
																		{item.icon}
																	</Text>
																	<VStack align="start" spacing={1} flex="1">
																		<Heading
																			as="h4"
																			fontSize={{ base: "lg", md: "xl" }}
																			fontWeight="500"
																			color="white"
																		>
																			{item.title}
																		</Heading>
																		{item.description && (
																			<Text
																				fontSize={{ base: "sm", md: "md" }}
																				color="gray.400"
																				lineHeight="1.6"
																			>
																				{item.description}
																			</Text>
																		)}
																	</VStack>
																</HStack>
															</Card>
														</motion.div>
													))}
												</VStack>
											</Box>
										)}

										{/* Dodatne pogodnosti */}
										{price.additionalBenefits && (
											<Box
												bg="gray.800"
												borderLeft="3px solid"
												borderColor="yellow.400"
												p={5}
												borderRadius="md"
											>
												<Text
													fontSize={{ base: "md", md: "lg" }}
													fontWeight="500"
													color="yellow.400"
													mb={3}
												>
													⚡ Dodatne pogodnosti
												</Text>
												<VStack align="flex-start" spacing={2}>
													{price.additionalBenefits.split("•").map((item, idx) => {
														const trimmed = item.trim();
														return trimmed ? (
															<Text key={idx} fontSize={{ base: "md", md: "lg" }} color="gray.300">
																• {trimmed}
															</Text>
														) : null;
													})}
												</VStack>
											</Box>
										)}

										{/* Napomena */}
										{price.note && (
											<Box
												bg="gray.800"
												borderLeft="3px solid"
												borderColor="yellow.400"
												p={5}
												borderRadius="md"
											>
												<Text fontSize={{ base: "sm", md: "md" }} color="gray.300" lineHeight="1.7">
													<Text as="span" fontWeight="semibold" color="yellow.400">
														Napomena:{" "}
													</Text>
													{price.note}
												</Text>
											</Box>
										)}
									</VStack>
								</CardBody>
							</Card>
						</motion.div>
					)}

					{/* Footer Note */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						style={{ width: "100%" }}
					>
						<Box
							bg="gray.900"
							borderWidth="1px"
							borderColor="gray.800"
							borderRadius="none"
							p={{ base: 6, md: 8 }}
							textAlign="center"
						>
							<Text fontSize={{ base: "sm", md: "md" }} color="gray.400" lineHeight="1.7">
								Za dodatne informacije i rezervacije, kontaktirajte nas putem{" "}
								<Text as="span" color="yellow.400" fontWeight="500">
									formulara za rezervaciju
								</Text>{" "}
								ili direktno na našim kontakt podacima.
							</Text>
						</Box>
					</motion.div>
				</VStack>
			</Container>
		</Box>
	);
}
