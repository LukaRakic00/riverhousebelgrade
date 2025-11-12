"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SafeImage } from "../../components/SafeImage";
import {
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Container,
	Flex,
	Grid,
	GridItem,
	Heading,
	HStack,
	Input,
	SimpleGrid,
	Spinner,
	Stack,
	Text,
	Tooltip,
	useToast,
	Divider,
	Badge,
	VStack,
	Icon,
	IconButton,
	InputGroup,
	InputLeftElement,
	Alert,
	AlertIcon,
	AlertDescription,
	Progress,
} from "@chakra-ui/react";
import { FiLogOut, FiRefreshCw, FiSave, FiTrash, FiUpload, FiImage, FiCheck, FiX, FiFolder } from "react-icons/fi";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SiteConfig = {
	heroImageUrl: string;
	galleryImageUrls: string[];
};

export default function AdminPage() {
	const router = useRouter();
	const toast = useToast();

	const [loading, setLoading] = useState(false);
	const [config, setConfig] = useState<SiteConfig | null>(null);
	const [heroUrlEdit, setHeroUrlEdit] = useState<string>("");
	const [galleryEdits, setGalleryEdits] = useState<string[]>([]);

	const [cloudFolder, setCloudFolder] = useState<string>("river-house-belgrade");
	const [cloudLoading, setCloudLoading] = useState(false);
	const [cloudUrls, setCloudUrls] = useState<string[]>([]);
	const [selected, setSelected] = useState<Record<string, boolean>>({});
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	useEffect(() => {
		const load = async () => {
			const res = await fetch("/api/images", { cache: "no-store" });
			const data = await res.json();
			setConfig(data);
			setHeroUrlEdit(data.heroImageUrl || "");
			setGalleryEdits(data.galleryImageUrls || []);
		};
		load();
	}, []);

	const saveConfig = async (next: SiteConfig) => {
		setLoading(true);
		try {
			const res = await fetch("/api/images", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(next),
			});
			if (!res.ok) throw new Error("Nije moguće snimiti konfiguraciju.");
			const data = await res.json();
			setConfig(data);
			setHeroUrlEdit(data.heroImageUrl || "");
			setGalleryEdits(data.galleryImageUrls || []);
			toast({ title: "Sačuvano", status: "success", description: "Promene su uspešno sačuvane u bazu podataka." });
		} catch (e: any) {
			toast({ title: "Greška", description: e?.message, status: "error" });
		} finally {
			setLoading(false);
		}
	};

	const onLogout = async () => {
		await fetch("/api/admin/logout", { method: "POST" });
		router.replace("/admin/login");
	};

	const loadCloudinary = async () => {
		setCloudLoading(true);
		try {
			const res = await fetch(`/api/cloudinary/list?folder=${encodeURIComponent(cloudFolder)}&max=500`, { cache: "no-store" });
			const data = await res.json();
			if (data?.urls) {
				setCloudUrls(data.urls);
				toast({ title: "Učitano", description: `Pronađeno ${data.urls.length} slika u folderu "${cloudFolder}"`, status: "success" });
			}
		} catch (e: any) {
			toast({ title: "Greška", description: e?.message || "Greška pri učitavanju slika", status: "error" });
		} finally {
			setCloudLoading(false);
		}
	};

	const uploadToCloudinary = async (files: FileList) => {
		setUploading(true);
		setUploadProgress(0);
		const uploaded: string[] = [];
		const total = files.length;

		try {
			for (let i = 0; i < files.length; i++) {
				const file = files.item(i);
				if (!file) continue;

				const form = new FormData();
				form.append("file", file);
				const res = await fetch("/api/upload", { method: "POST", body: form });
				
				if (res.ok) {
					const d = await res.json();
					if (d?.url) {
						uploaded.push(d.url);
						setUploadProgress(((i + 1) / total) * 100);
					}
				}
			}

			if (uploaded.length > 0) {
				setCloudUrls((prev) => [...uploaded, ...prev]);
				toast({
					title: "Uspešno uploadovano",
					description: `${uploaded.length} slika je uploadovano na Cloudinary`,
					status: "success",
				});
			}
		} catch (e: any) {
			toast({ title: "Greška", description: e?.message || "Greška pri upload-u", status: "error" });
		} finally {
			setUploading(false);
			setUploadProgress(0);
		}
	};

	const selectedUrls = useMemo(() => Object.keys(selected).filter((u) => selected[u]), [selected]);

	const addSelectedToGallery = () => {
		setGalleryEdits((prev) => {
			const set = new Set(prev);
			for (const u of selectedUrls) set.add(u);
			return Array.from(set);
		});
		toast({ title: "Dodato u galeriju", description: `${selectedUrls.length} slika je dodato u galeriju`, status: "success" });
		setSelected({});
	};

	const removeFromGallery = (url: string) => {
		setGalleryEdits((prev) => prev.filter((u) => u !== url));
		toast({ title: "Uklonjeno", description: "Slika je uklonjena iz galerije", status: "info" });
	};

	const logoUrl = 'https://res.cloudinary.com/dvohrn0zf/image/upload/v1762935030/s25-removebg-preview_yquban.png';

	return (
		<Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }} py={8}>
			<Container maxW="container.xl">
				{/* Header */}
				<Card mb={6} borderRadius="xl" boxShadow="lg">
					<CardBody>
						<Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
							<HStack spacing={4}>
								<Box>
									<Image
										src={logoUrl}
										alt="Belgrade River House"
										width={120}
										height={60}
										style={{ height: 'auto', maxHeight: '60px', width: 'auto' }}
									/>
								</Box>
								<VStack align="start" spacing={0}>
									<Heading size="lg" color="gray.800" _dark={{ color: "white" }}>
										Admin Panel
									</Heading>
									<Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
										Belgrade River House
									</Text>
								</VStack>
							</HStack>
							<Button
								variant="outline"
								leftIcon={<FiLogOut />}
								onClick={onLogout}
								colorScheme="red"
								borderRadius="md"
							>
								Odjava
							</Button>
						</Flex>
					</CardBody>
				</Card>

				{/* Hero Slika */}
				<Card mb={6} borderRadius="xl" boxShadow="lg">
					<CardHeader bg="purple.50" _dark={{ bg: "purple.900" }} borderTopRadius="xl">
						<Heading size="md" color="purple.700" _dark={{ color: "purple.200" }}>
							Hero Slika
						</Heading>
					</CardHeader>
					<CardBody>
						<Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} alignItems="start">
							<Box
								borderWidth="2px"
								borderStyle="dashed"
								borderColor="gray.300"
								borderRadius="lg"
								overflow="hidden"
								minH="300px"
								display="flex"
								alignItems="center"
								justifyContent="center"
								bg="gray.50"
								_dark={{ borderColor: "gray.600", bg: "gray.800" }}
							>
								{heroUrlEdit ? (
									<SafeImage
										src={heroUrlEdit}
										alt="Hero"
										width={1200}
										height={800}
										style={{ width: "100%", height: "auto", maxHeight: "400px", objectFit: "contain" }}
									/>
								) : (
									<VStack color="gray.400">
										<Icon as={FiImage} boxSize={12} />
										<Text>Nema postavljene hero slike</Text>
									</VStack>
								)}
							</Box>
							<Stack spacing={4}>
								<InputGroup>
									<InputLeftElement pointerEvents="none">
										<Icon as={FiImage} color="gray.400" />
									</InputLeftElement>
									<Input
										placeholder="https://res.cloudinary.com/..."
										value={heroUrlEdit}
										onChange={(e) => setHeroUrlEdit(e.target.value)}
										borderRadius="md"
									/>
								</InputGroup>
								<Button
									colorScheme="purple"
									leftIcon={<FiSave />}
									isLoading={loading}
									onClick={() => config && saveConfig({ ...config, heroImageUrl: heroUrlEdit })}
									borderRadius="md"
									w="100%"
								>
									Sačuvaj Hero URL
								</Button>
							</Stack>
						</Grid>
					</CardBody>
				</Card>

				{/* Cloudinary Pregled i Upload */}
				<Card mb={6} borderRadius="xl" boxShadow="lg">
					<CardHeader bg="blue.50" _dark={{ bg: "blue.900" }} borderTopRadius="xl">
						<Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
							<Heading size="md" color="blue.700" _dark={{ color: "blue.200" }}>
								Cloudinary Pregled
							</Heading>
							<Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
								{cloudUrls.length} slika
							</Badge>
						</Flex>
					</CardHeader>
					<CardBody>
						<Stack spacing={6}>
							{/* Upload Section */}
							<Box
								borderWidth="2px"
								borderStyle="dashed"
								borderColor="blue.300"
								borderRadius="lg"
								p={6}
								bg="blue.50"
								_dark={{ borderColor: "blue.600", bg: "blue.900" }}
							>
								<VStack spacing={4}>
									<Icon as={FiUpload} boxSize={10} color="blue.500" />
									<Text fontWeight="semibold" color="blue.700" _dark={{ color: "blue.200" }}>
										Upload slika na Cloudinary
									</Text>
									<Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} textAlign="center">
										Možete uploadovati više slika odjednom. Sve slike će biti automatski sačuvane u Cloudinary folderu.
									</Text>
									<input
										id="cloudinary-upload-input"
										type="file"
										accept="image/*"
										multiple
										style={{ display: "none" }}
										onChange={(e) => {
											if (e.target.files && e.target.files.length > 0) {
												uploadToCloudinary(e.target.files);
											}
										}}
									/>
									<Button
										colorScheme="blue"
										leftIcon={<FiUpload />}
										onClick={() => {
											document.getElementById("cloudinary-upload-input")?.click();
										}}
										isLoading={uploading}
										disabled={uploading}
										borderRadius="md"
										size="lg"
									>
										{uploading ? `Uploadujem... ${Math.round(uploadProgress)}%` : "Izaberi slike za upload"}
									</Button>
									{uploading && (
										<Box w="100%">
											<Progress value={uploadProgress} colorScheme="blue" borderRadius="full" />
										</Box>
									)}
								</VStack>
							</Box>

							<Divider />

							{/* Folder Selection */}
							<HStack spacing={3} flexWrap="wrap">
								<InputGroup flex="1" minW="200px">
									<InputLeftElement pointerEvents="none">
										<Icon as={FiFolder} color="gray.400" />
									</InputLeftElement>
									<Input
										placeholder="cloudinary folder"
										value={cloudFolder}
										onChange={(e) => setCloudFolder(e.target.value)}
										borderRadius="md"
									/>
								</InputGroup>
								<Button
									leftIcon={<FiRefreshCw />}
									onClick={loadCloudinary}
									isLoading={cloudLoading}
									colorScheme="blue"
									borderRadius="md"
								>
									Učitaj folder
								</Button>
							</HStack>

							{/* Selection Controls */}
							{cloudUrls.length > 0 && (
								<Alert status="info" borderRadius="md">
									<AlertIcon />
									<AlertDescription flex="1">
										<HStack spacing={4} flexWrap="wrap">
											<Text>
												Selektovano: <strong>{selectedUrls.length}</strong> od {cloudUrls.length} slika
											</Text>
											{selectedUrls.length > 0 && (
												<HStack>
													<Button
														size="sm"
														colorScheme="purple"
														leftIcon={<FiCheck />}
														onClick={addSelectedToGallery}
														borderRadius="md"
													>
														Dodaj u galeriju ({selectedUrls.length})
													</Button>
													<Button
														size="sm"
														variant="ghost"
														leftIcon={<FiX />}
														onClick={() => setSelected({})}
														borderRadius="md"
													>
														Poništi
													</Button>
												</HStack>
											)}
										</HStack>
									</AlertDescription>
								</Alert>
							)}

							{/* Cloudinary Images Grid */}
							{cloudLoading ? (
								<Flex justify="center" py={12}>
									<Spinner size="xl" color="blue.500" />
								</Flex>
							) : cloudUrls.length === 0 ? (
								<Box textAlign="center" py={12} color="gray.500">
									<Icon as={FiImage} boxSize={16} mb={4} />
									<Text fontSize="lg">Nema slika u folderu</Text>
									<Text fontSize="sm" mt={2}>Uploadujte slike ili učitajte drugi folder</Text>
								</Box>
							) : (
								<SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
									{cloudUrls.map((u) => (
										<Box
											key={u}
											borderWidth="2px"
											borderColor={selected[u] ? "purple.500" : "gray.200"}
											_dark={{ borderColor: selected[u] ? "purple.500" : "gray.700" }}
											borderRadius="lg"
											overflow="hidden"
											position="relative"
											cursor="pointer"
											onClick={() => setSelected((s) => ({ ...s, [u]: !s[u] }))}
											transition="all 0.2s"
											_hover={{
												transform: "scale(1.05)",
												boxShadow: "lg",
											}}
										>
											<SafeImage
												src={u}
												alt="cloud"
												width={400}
												height={300}
												style={{ width: "100%", height: "auto", display: "block" }}
											/>
											{selected[u] && (
												<Box
													position="absolute"
													top="2"
													right="2"
													bg="purple.500"
													borderRadius="full"
													p={1}
												>
													<Icon as={FiCheck} color="white" boxSize={4} />
												</Box>
											)}
										</Box>
									))}
								</SimpleGrid>
							)}
						</Stack>
					</CardBody>
				</Card>

				{/* Galerija (Baza podataka) */}
				<Card mb={6} borderRadius="xl" boxShadow="lg">
					<CardHeader bg="green.50" _dark={{ bg: "green.900" }} borderTopRadius="xl">
						<Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
							<Heading size="md" color="green.700" _dark={{ color: "green.200" }}>
								Galerija (Baza podataka)
							</Heading>
							<Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full">
								{galleryEdits.length} slika
							</Badge>
						</Flex>
					</CardHeader>
					<CardBody>
						<Stack spacing={6}>
							<Alert status="info" borderRadius="md">
								<AlertIcon />
								<AlertDescription>
									Ove slike se prikazuju na sajtu. Izaberite slike iz Cloudinary pregleda ili dodajte URL-ove ručno.
								</AlertDescription>
							</Alert>

							{galleryEdits.length === 0 ? (
								<Box textAlign="center" py={12} color="gray.500">
									<Icon as={FiImage} boxSize={16} mb={4} />
									<Text fontSize="lg">Galerija je prazna</Text>
									<Text fontSize="sm" mt={2}>Dodajte slike iz Cloudinary pregleda ili unesite URL-ove</Text>
								</Box>
							) : (
								<SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={4}>
									{galleryEdits.map((u) => (
										<Box
											key={u}
											borderWidth="1px"
											borderRadius="lg"
											overflow="hidden"
											bg="white"
											_dark={{ bg: "gray.800" }}
										>
											<SafeImage
												src={u}
												alt="gallery"
												width={400}
												height={300}
												style={{ width: "100%", height: "auto", display: "block" }}
											/>
											<Button
												w="100%"
												size="sm"
												variant="ghost"
												leftIcon={<FiTrash />}
												onClick={() => removeFromGallery(u)}
												colorScheme="red"
												borderRadius="none"
											>
												Ukloni
											</Button>
										</Box>
									))}
								</SimpleGrid>
							)}

							<Divider />

							{/* Manual URL Input */}
							<InputGroup>
								<InputLeftElement pointerEvents="none">
									<Icon as={FiImage} color="gray.400" />
								</InputLeftElement>
								<Input
									placeholder="Dodaj URL slike (Enter za dodavanje)"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											const v = (e.target as HTMLInputElement).value.trim();
											if (v) {
												setGalleryEdits((prev) => Array.from(new Set([...prev, v])));
												(e.target as HTMLInputElement).value = "";
												toast({ title: "Dodato", description: "Slika je dodata u galeriju", status: "success" });
											}
										}
									}}
									borderRadius="md"
								/>
							</InputGroup>

							{/* Save Button */}
							<Button
								colorScheme="green"
								leftIcon={<FiSave />}
								isLoading={loading}
								onClick={() => config && saveConfig({ ...config, heroImageUrl: heroUrlEdit, galleryImageUrls: galleryEdits })}
								borderRadius="md"
								size="lg"
								w="100%"
							>
								Sačuvaj sve promene u bazu podataka
							</Button>
						</Stack>
					</CardBody>
				</Card>
			</Container>
		</Box>
	);
}
