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
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Textarea,
} from "@chakra-ui/react";
import { FiLogOut, FiRefreshCw, FiSave, FiTrash, FiUpload, FiImage, FiCheck, FiX, FiFolder, FiPlus, FiEdit2, FiArrowUp, FiArrowDown } from "react-icons/fi";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SiteConfig = {
	heroImageUrl: string;
	featuredImages: string[];
	instagramImages: string[];
};

type Category = {
	_id: string;
	name: string;
	description?: string;
	imageUrls: string[];
	order: number;
};

type AdminReview = {
	_id: string;
	authorName: string;
	rating: number;
	text: string;
	imageUrl?: string;
	createdAt?: string;
};


export default function AdminPage() {
	const router = useRouter();
	const toast = useToast();

	const [loading, setLoading] = useState(false);
	const [config, setConfig] = useState<SiteConfig | null>(null);
	const [heroUrlEdit, setHeroUrlEdit] = useState<string>("");
	const [featuredEdits, setFeaturedEdits] = useState<string[]>([]);
	const [instagramEdits, setInstagramEdits] = useState<string[]>([]);
	const [newInstagramUrl, setNewInstagramUrl] = useState<string>("");

	// Categories state
	const [categories, setCategories] = useState<Category[]>([]);
	const [categoriesLoading, setCategoriesLoading] = useState(false);
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategoryDesc, setNewCategoryDesc] = useState("");
	const [categoryImages, setCategoryImages] = useState<string[]>([]);
	const [reviews, setReviews] = useState<AdminReview[]>([]);
	const [reviewsLoading, setReviewsLoading] = useState(false);
	const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);



	const [cloudFolder, setCloudFolder] = useState<string>("river-house-belgrade");
	const [cloudLoading, setCloudLoading] = useState(false);
	const [cloudUrls, setCloudUrls] = useState<string[]>([]);
	const [cloudImages, setCloudImages] = useState<Array<{ url: string; publicId: string }>>([]);
	const [selected, setSelected] = useState<Record<string, boolean>>({});
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [deletingImage, setDeletingImage] = useState<string | null>(null);

	const selectedUrls = useMemo(() => Object.keys(selected).filter((u) => selected[u]), [selected]);

	const addToastInfo = (description: string) => toast({ title: "Info", description, status: "info" });

	const handleAddSelectedToFeatured = () => {
		if (selectedUrls.length === 0) {
			addToastInfo("Najpre izaberi slike iz Cloudinary liste.");
			return;
		}
		if (featuredEdits.length >= 6) {
			toast({ title: "Limit", description: "Maksimalno 6 udarnih slika.", status: "warning" });
			return;
		}
		const filtered = selectedUrls.filter((url) => !featuredEdits.includes(url));
		if (filtered.length === 0) {
			addToastInfo("Sve izabrane slike su već dodate.");
			return;
		}
		const merged = [...featuredEdits, ...filtered].slice(0, 6);
		const diff = merged.length - featuredEdits.length;
		setFeaturedEdits(merged);
		setSelected({});
		toast({ title: "Dodato", description: `${diff} slika dodato u udarne.`, status: "success" });
	};

	const handleAddSelectedToInstagram = () => {
		if (selectedUrls.length === 0) {
			addToastInfo("Najpre izaberi slike iz Cloudinary liste.");
			return;
		}
		if (instagramEdits.length >= 8) {
			toast({ title: "Limit", description: "Maksimalno 8 Instagram slika.", status: "warning" });
			return;
		}
		const filtered = selectedUrls.filter((url) => !instagramEdits.includes(url));
		if (filtered.length === 0) {
			addToastInfo("Sve izabrane slike su već dodate.");
			return;
		}
		const merged = [...instagramEdits, ...filtered].slice(0, 8);
		const diff = merged.length - instagramEdits.length;
		setInstagramEdits(merged);
		setSelected({});
		toast({ title: "Dodato", description: `${diff} slika dodato u Instagram rotaciju.`, status: "success" });
	};

	useEffect(() => {
		const load = async () => {
			const res = await fetch("/api/images", { cache: "no-store" });
			const data = await res.json();
			setConfig(data);
			setHeroUrlEdit(data.heroImageUrl || "");
			setFeaturedEdits(data.featuredImages || []);
			setInstagramEdits(data.instagramImages || []);
		};
		load();
		loadCategories();
		loadReviews();
	}, []);

	const loadCategories = async () => {
		setCategoriesLoading(true);
		try {
			const res = await fetch("/api/categories", { cache: "no-store" });
			const data = await res.json();
			setCategories(data || []);
		} catch (e: any) {
			toast({ title: "Greška", description: e?.message || "Greška pri učitavanju kategorija", status: "error" });
		} finally {
			setCategoriesLoading(false);
		}
	};


	const loadReviews = async () => {
		setReviewsLoading(true);
		try {
			const res = await fetch("/api/reviews", { cache: "no-store" });
			const data = await res.json();
			setReviews(Array.isArray(data) ? data : []);
		} catch (e: any) {
			toast({ title: "Greška", description: e?.message || "Greška pri učitavanju recenzija", status: "error" });
		} finally {
			setReviewsLoading(false);
		}
	};

	const handleDeleteReview = async (id: string) => {
		if (!confirm("Da li si siguran da želiš da obrišeš ovu recenziju?")) return;
		setDeletingReviewId(id);
		try {
			const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err?.error || "Greška pri brisanju recenzije");
			}
			toast({ title: "Obrisano", status: "success", description: "Recenzija je uklonjena." });
			await loadReviews();
		} catch (e: any) {
			toast({ title: "Greška", description: e?.message || "Greška pri brisanju recenzije", status: "error" });
		} finally {
			setDeletingReviewId(null);
		}
	};


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
		setFeaturedEdits(data.featuredImages || []);
		setInstagramEdits(data.instagramImages || []);
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
				setCloudImages(data.images || data.urls.map((url: string) => ({ url, publicId: "" })));
				toast({ title: "Učitano", description: `Pronađeno ${data.urls.length} slika u folderu "${cloudFolder}"`, status: "success" });
			}
		} catch (e: any) {
			toast({ title: "Greška", description: e?.message || "Greška pri učitavanju slika", status: "error" });
		} finally {
			setCloudLoading(false);
		}
	};

	const deleteCloudinaryImage = async (url: string, publicId?: string) => {
		if (!confirm("Da li ste sigurni da želite da obrišete ovu sliku iz Cloudinary-a? Ova akcija je nepovratna.")) {
			return;
		}

		setDeletingImage(url);
		try {
			const params = new URLSearchParams();
			if (publicId) {
				params.append("publicId", publicId);
			} else {
				params.append("url", url);
			}

			const res = await fetch(`/api/cloudinary/delete?${params.toString()}`, {
				method: "DELETE",
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.error || "Greška pri brisanju");
			}

			// Ukloni sliku iz liste
			setCloudUrls((prev) => prev.filter((u) => u !== url));
			setCloudImages((prev) => prev.filter((img) => img.url !== url));
			setSelected((prev) => {
				const newSelected = { ...prev };
				delete newSelected[url];
				return newSelected;
			});

			toast({ title: "Uspešno", description: "Slika je obrisana iz Cloudinary-a", status: "success" });
		} catch (e: any) {
			toast({ title: "Greška", description: e?.message || "Greška pri brisanju slike", status: "error" });
		} finally {
			setDeletingImage(null);
		}
	};

	const uploadToCloudinary = async (files: FileList) => {
		setUploading(true);
		setUploadProgress(0);
		const uploaded: Array<{ url: string; publicId: string }> = [];
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
						uploaded.push({
							url: d.url,
							publicId: d.publicId || "",
						});
						setUploadProgress(((i + 1) / total) * 100);
					}
				}
			}

			if (uploaded.length > 0) {
				setCloudUrls((prev) => [...uploaded.map((u) => u.url), ...prev]);
				setCloudImages((prev) => [...uploaded, ...prev]);
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

	const logoUrl = "/static/favicons/s25-removebg-preview.png";

	return (
		<Box minH="100vh" bg="gray.50" _dark={{ bg: "gray.900" }} pt={{ base: 24, md: 32 }} pb={8}>
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

				{/* Accordion za sve sekcije */}
				<Accordion allowMultiple defaultIndex={[]} mb={6}>
					{/* Hero Slika */}
					<AccordionItem mb={6} borderRadius="xl" overflow="hidden" boxShadow="lg" bg="white" _dark={{ bg: "gray.800" }}>
						<AccordionButton
							bg="purple.50"
							_dark={{ bg: "purple.900" }}
							py={4}
							px={6}
							_hover={{ bg: "purple.100", _dark: { bg: "purple.800" } }}
						>
							<Box flex="1" textAlign="left">
								<Heading size="md" color="purple.700" _dark={{ color: "purple.200" }}>
									Hero Slika
								</Heading>
							</Box>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel pb={6} px={6}>
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
									onClick={() => config && saveConfig({ ...config, heroImageUrl: heroUrlEdit, instagramImages: instagramEdits })}
									borderRadius="md"
									w="100%"
								>
									Sačuvaj Hero URL
							</Button>
						</Stack>
					</Grid>
						</AccordionPanel>
					</AccordionItem>

					{/* Upload slika na Cloudinary */}
					<AccordionItem mb={6} borderRadius="xl" overflow="hidden" boxShadow="lg" bg="white" _dark={{ bg: "gray.800" }}>
						<AccordionButton
							bg="green.50"
							_dark={{ bg: "green.900" }}
							py={4}
							px={6}
							_hover={{ bg: "green.100", _dark: { bg: "green.800" } }}
						>
							<Box flex="1" textAlign="left">
								<Heading size="md" color="green.700" _dark={{ color: "green.200" }}>
									Upload slika na Cloudinary
								</Heading>
							</Box>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel pb={6} px={6}>
							<Stack spacing={6}>
								<Box
									borderWidth="2px"
									borderStyle="dashed"
									borderColor="green.300"
									borderRadius="lg"
									p={6}
									bg="green.50"
									_dark={{ borderColor: "green.600", bg: "green.900" }}
								>
									<VStack spacing={4}>
										<Icon as={FiUpload} boxSize={10} color="green.500" />
										<Text fontWeight="semibold" color="green.700" _dark={{ color: "green.200" }}>
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
											colorScheme="green"
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
												<Progress value={uploadProgress} colorScheme="green" borderRadius="full" />
											</Box>
										)}
									</VStack>
								</Box>
							</Stack>
						</AccordionPanel>
					</AccordionItem>

					{/* Cloudinary Pregled */}
					<AccordionItem mb={6} borderRadius="xl" overflow="hidden" boxShadow="lg" bg="white" _dark={{ bg: "gray.800" }}>
						<AccordionButton
							bg="blue.50"
							_dark={{ bg: "blue.900" }}
							py={4}
							px={6}
							_hover={{ bg: "blue.100", _dark: { bg: "blue.800" } }}
						>
							<Box flex="1" textAlign="left">
								<Flex justify="space-between" align="center" flexWrap="wrap" gap={4} w="100%">
									<Heading size="md" color="blue.700" _dark={{ color: "blue.200" }}>
										Cloudinary Pregled
									</Heading>
									<Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="full">
										{cloudUrls.length} slika
									</Badge>
								</Flex>
							</Box>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel pb={6} px={6}>
						<Stack spacing={6}>

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
										<VStack spacing={3} align="stretch">
											<Text>
												Selektovano: <strong>{selectedUrls.length}</strong> od {cloudUrls.length} slika
											</Text>
											{selectedUrls.length > 0 && (
												<HStack spacing={2} flexWrap="wrap">
													<Button
														size="sm"
														colorScheme="orange"
														leftIcon={<FiCheck />}
														onClick={handleAddSelectedToFeatured}
														isDisabled={featuredEdits.length >= 6}
														borderRadius="md"
													>
														Dodaj u udarne slike ({selectedUrls.length})
													</Button>
													<Button
														size="sm"
														colorScheme="pink"
														leftIcon={<FiCheck />}
														onClick={handleAddSelectedToInstagram}
														isDisabled={instagramEdits.length >= 8}
														borderRadius="md"
													>
														Dodaj u Instagram ({selectedUrls.length})
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
										</VStack>
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
									{cloudUrls.map((u) => {
										const imageData = cloudImages.find((img) => img.url === u);
										const publicId = imageData?.publicId;
										return (
											<Box
												key={u}
												borderWidth="2px"
												borderColor={selected[u] ? "purple.500" : "gray.200"}
												_dark={{ borderColor: selected[u] ? "purple.500" : "gray.700" }}
												borderRadius="lg"
												overflow="hidden"
												position="relative"
												transition="all 0.2s"
												_hover={{
													transform: "scale(1.05)",
													boxShadow: "lg",
												}}
											>
												<Box
													cursor="pointer"
													onClick={() => setSelected((s) => ({ ...s, [u]: !s[u] }))}
												>
													<SafeImage
														src={u}
														alt="cloud"
														width={400}
														height={300}
														style={{ width: "100%", height: "auto", display: "block" }}
													/>
												</Box>
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
												<IconButton
													aria-label="Obriši sliku"
													icon={<FiTrash />}
													size="sm"
													position="absolute"
													bottom="2"
													right="2"
													bg="red.500"
													color="white"
													borderRadius="full"
													isLoading={deletingImage === u}
													onClick={(e) => {
														e.stopPropagation();
														deleteCloudinaryImage(u, publicId);
													}}
													_hover={{ bg: "red.600" }}
													zIndex={2}
												/>
											</Box>
										);
									})}
								</SimpleGrid>
							)}
						</Stack>
						</AccordionPanel>
					</AccordionItem>

					{/* Featured Images (6 udarnih slika za landing page) */}
					<AccordionItem mb={6} borderRadius="xl" overflow="hidden" boxShadow="lg" bg="white" _dark={{ bg: "gray.800" }}>
						<AccordionButton
							bg="orange.50"
							_dark={{ bg: "orange.900" }}
							py={4}
							px={6}
							_hover={{ bg: "orange.100", _dark: { bg: "orange.800" } }}
						>
							<Box flex="1" textAlign="left">
								<Flex justify="space-between" align="center" flexWrap="wrap" gap={4} w="100%">
									<Heading size="md" color="orange.700" _dark={{ color: "orange.200" }}>
										Udarne slike za Landing Page (Max 6)
									</Heading>
									<Badge colorScheme="orange" fontSize="md" px={3} py={1} borderRadius="full">
										{featuredEdits.length} / 6 slika
									</Badge>
								</Flex>
							</Box>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel pb={6} px={6}>
						<Stack spacing={6}>
							<Alert status="warning" borderRadius="md">
								<AlertIcon />
								<AlertDescription>
									Ove slike se prikazuju u sekciji "Galerija - Uživaj u prirodi" na landing page-u. Maksimalno 6 slika.
								</AlertDescription>
							</Alert>

							{featuredEdits.length === 0 ? (
								<Box textAlign="center" py={12} color="gray.500">
									<Icon as={FiImage} boxSize={16} mb={4} />
									<Text fontSize="lg">Nema udarnih slika</Text>
									<Text fontSize="sm" mt={2}>Dodajte slike iz Cloudinary pregleda</Text>
								</Box>
							) : (
								<SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={4}>
									{featuredEdits.map((u, idx) => (
										<Box
											key={idx}
											borderWidth="2px"
											borderColor="orange.300"
											borderRadius="lg"
											overflow="hidden"
											bg="white"
											_dark={{ bg: "gray.800" }}
											position="relative"
										>
											<Box position="absolute" top="2" left="2" zIndex={2}>
												<Badge colorScheme="orange">{idx + 1}</Badge>
										</Box>
											<VStack position="absolute" top="2" right="2" spacing={1} zIndex={2}>
												<IconButton
													size="xs"
													aria-label="Pomeri gore"
													icon={<FiArrowUp />}
													isDisabled={idx === 0}
													onClick={() => {
														if (idx === 0) return;
														const next = [...featuredEdits];
														[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
														setFeaturedEdits(next);
													}}
												/>
												<IconButton
													size="xs"
													aria-label="Pomeri dole"
													icon={<FiArrowDown />}
													isDisabled={idx === featuredEdits.length - 1}
													onClick={() => {
														if (idx === featuredEdits.length - 1) return;
														const next = [...featuredEdits];
														[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
														setFeaturedEdits(next);
													}}
												/>
											</VStack>
											<SafeImage
												src={u}
												alt={`Featured ${idx + 1}`}
												width={400}
												height={300}
												style={{ width: "100%", height: "auto", display: "block" }}
											/>
											<Button
												w="100%"
												size="sm"
												variant="ghost"
												leftIcon={<FiTrash />}
												onClick={() => setFeaturedEdits((prev) => prev.filter((_, i) => i !== idx))}
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

							<Alert status="info" borderRadius="md">
								<AlertIcon />
								<AlertDescription>
									Izaberite slike iz Cloudinary pregleda gore i kliknite "Dodaj u udarne slike" da ih dodate ovde.
								</AlertDescription>
							</Alert>

							<HStack spacing={3}>
								<Button
									colorScheme="orange"
									leftIcon={<FiCheck />}
									onClick={handleAddSelectedToFeatured}
									isDisabled={featuredEdits.length >= 6}
									borderRadius="md"
								>
									Dodaj selektovane u udarne slike ({selectedUrls.length})
								</Button>
								{featuredEdits.length > 0 && (
									<Button
										variant="outline"
										onClick={() => setFeaturedEdits([])}
										borderRadius="md"
									>
										Obriši sve
									</Button>
								)}
							</HStack>

							{/* Save Button */}
							<Button
								colorScheme="orange"
								leftIcon={<FiSave />}
								isLoading={loading}
								onClick={() =>
									config &&
									saveConfig({
										...config,
										heroImageUrl: heroUrlEdit,
										featuredImages: featuredEdits,
										instagramImages: instagramEdits,
									})
								}
								borderRadius="md"
								size="lg"
								w="100%"
							>
								Sačuvaj udarne slike
							</Button>
					</Stack>
						</AccordionPanel>
					</AccordionItem>

					{/* Instagram feed slike */}
					<AccordionItem mb={6} borderRadius="xl" overflow="hidden" boxShadow="lg" bg="white" _dark={{ bg: "gray.800" }}>
						<AccordionButton
							bg="pink.50"
							_dark={{ bg: "pink.900" }}
							py={4}
							px={6}
							_hover={{ bg: "pink.100", _dark: { bg: "pink.800" } }}
						>
							<Box flex="1" textAlign="left">
								<Flex justify="space-between" align="center" flexWrap="wrap" gap={4} w="100%">
									<Heading size="md" color="pink.700" _dark={{ color: "pink.200" }}>
										Instagram feed slike (rotacija, max 8)
									</Heading>
									<Badge colorScheme="pink" fontSize="md" px={3} py={1} borderRadius="full">
										{instagramEdits.length} / 8 slika
									</Badge>
								</Flex>
							</Box>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel pb={6} px={6}>
							<Stack spacing={6}>
								<Alert status="info" borderRadius="md">
									<AlertIcon />
									<AlertDescription>
										Slike u ovoj sekciji rotiraju se na landing stranici (Instagram blok) na svakih 5 sekundi.
									</AlertDescription>
								</Alert>

								{instagramEdits.length === 0 ? (
									<Box textAlign="center" py={10} color="gray.500">
										<Icon as={FiImage} boxSize={14} mb={4} />
										<Text fontSize="lg">Još uvek nema Instagram slika</Text>
										<Text fontSize="sm" mt={2}>
											Izaberi slike iz Cloudinary pregleda iznad i dodaj ih ovde.
										</Text>
									</Box>
								) : (
									<SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
										{instagramEdits.map((url, idx) => (
											<Box
												key={idx}
												borderWidth="2px"
												borderColor="pink.300"
												borderRadius="lg"
												overflow="hidden"
												bg="white"
												_dark={{ bg: "gray.900" }}
												position="relative"
											>
												<Box position="absolute" top="2" left="2" zIndex={2}>
													<Badge colorScheme="pink">{idx + 1}</Badge>
												</Box>
												<SafeImage src={url} alt={`Instagram ${idx + 1}`} width={400} height={400} style={{ width: "100%", height: "auto" }} />
												<Button
													w="100%"
													size="sm"
													variant="ghost"
													leftIcon={<FiTrash />}
													onClick={() => setInstagramEdits((prev) => prev.filter((_, i) => i !== idx))}
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

								<Alert status="info" borderRadius="md">
									<AlertIcon />
									<AlertDescription>
										Selektuj slike iz Cloudinary liste iznad i klikni na dugme ispod da ih dodaš u Instagram rotaciju.
									</AlertDescription>
								</Alert>

								<HStack spacing={3} flexWrap="wrap">
									<Button
										colorScheme="pink"
										leftIcon={<FiCheck />}
										onClick={handleAddSelectedToInstagram}
										isDisabled={instagramEdits.length >= 8}
										borderRadius="md"
									>
										Dodaj selektovane u Instagram ({selectedUrls.length})
									</Button>
									{instagramEdits.length > 0 && (
										<Button variant="outline" onClick={() => setInstagramEdits([])} borderRadius="md">
											Obriši sve
										</Button>
									)}
									<Button variant="ghost" leftIcon={<FiRefreshCw />} onClick={() => setSelected({})}>
										Očisti selekciju
									</Button>
								</HStack>

								<Card variant="outline" p={4}>
									<VStack align="stretch" spacing={3}>
										<Text fontWeight="semibold">Dodaj direktan URL</Text>
										<InputGroup>
											<InputLeftElement pointerEvents="none">
												<Icon as={FiImage} color="gray.400" />
											</InputLeftElement>
											<Input
												placeholder="https://res.cloudinary.com/..."
												value={newInstagramUrl}
												onChange={(e) => setNewInstagramUrl(e.target.value)}
												borderRadius="md"
											/>
										</InputGroup>
										<Button
											colorScheme="pink"
											variant="solid"
											leftIcon={<FiPlus />}
											onClick={() => {
												if (!newInstagramUrl) {
													toast({ title: "Info", description: "Unesi validan URL slike.", status: "info" });
													return;
												}
												if (instagramEdits.length >= 8) {
													toast({ title: "Limit", description: "Maksimalno 8 slika u rotaciji.", status: "warning" });
													return;
												}
												if (instagramEdits.includes(newInstagramUrl)) {
													toast({ title: "Info", description: "Ova slika je već dodata.", status: "info" });
													return;
												}
												setInstagramEdits((prev) => [...prev, newInstagramUrl]);
												setNewInstagramUrl("");
												toast({ title: "Dodato", status: "success" });
											}}
										>
											Dodaj URL
										</Button>
									</VStack>
								</Card>

								<Button
									colorScheme="pink"
									leftIcon={<FiSave />}
									isLoading={loading}
									onClick={() =>
										config &&
										saveConfig({
											...config,
											heroImageUrl: heroUrlEdit,
											featuredImages: featuredEdits,
											instagramImages: instagramEdits,
										})
									}
									borderRadius="md"
									size="lg"
									w="100%"
								>
									Sačuvaj Instagram rotaciju
								</Button>
							</Stack>
						</AccordionPanel>
					</AccordionItem>

					{/* Kategorije */}
					<AccordionItem mb={6} borderRadius="xl" overflow="hidden" boxShadow="lg" bg="white" _dark={{ bg: "gray.800" }}>
						<AccordionButton
							bg="teal.50"
							_dark={{ bg: "teal.900" }}
							py={4}
							px={6}
							_hover={{ bg: "teal.100", _dark: { bg: "teal.800" } }}
						>
							<Box flex="1" textAlign="left">
								<Flex justify="space-between" align="center" flexWrap="wrap" gap={4} w="100%">
									<Heading size="md" color="teal.700" _dark={{ color: "teal.200" }}>
										Kategorije Galerije
									</Heading>
									<Badge colorScheme="teal" fontSize="md" px={3} py={1} borderRadius="full">
										{categories.length} kategorija
									</Badge>
								</Flex>
							</Box>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel pb={6} px={6}>
						<Stack spacing={6}>
							{/* Kreiranje nove kategorije */}
							<Card variant="outline" p={4}>
								<VStack spacing={4} align="stretch">
									<Heading size="sm">Nova kategorija</Heading>
									<InputGroup>
										<InputLeftElement pointerEvents="none">
											<Icon as={FiFolder} color="gray.400" />
										</InputLeftElement>
										<Input
											placeholder="Naziv kategorije"
											value={newCategoryName}
											onChange={(e) => setNewCategoryName(e.target.value)}
											borderRadius="md"
										/>
									</InputGroup>
									<Input
										placeholder="Opis kategorije (opciono)"
										value={newCategoryDesc}
										onChange={(e) => setNewCategoryDesc(e.target.value)}
										borderRadius="md"
									/>
									<HStack>
										<Button
											colorScheme="teal"
											leftIcon={<FiPlus />}
											onClick={async () => {
												if (!newCategoryName.trim()) {
													toast({ title: "Greška", description: "Naziv kategorije je obavezan", status: "error" });
													return;
												}
												try {
													const res = await fetch("/api/categories", {
														method: "POST",
														headers: { "Content-Type": "application/json" },
														body: JSON.stringify({
															name: newCategoryName.trim(),
															description: newCategoryDesc.trim() || undefined,
															imageUrls: categoryImages || [],
															order: categories.length,
														}),
													});
													if (!res.ok) {
														const errorData = await res.json().catch(() => ({}));
														throw new Error(errorData.error || "Greška pri kreiranju kategorije");
													}
													const created = await res.json();
													setNewCategoryName("");
													setNewCategoryDesc("");
													setCategoryImages([]);
													loadCategories();
													toast({ 
														title: "Uspešno", 
														description: `Kategorija "${created.name}" je kreirana sa ${created.imageUrls?.length || 0} slika`, 
														status: "success" 
													});
												} catch (e: any) {
													console.error("Create category error:", e);
													toast({ title: "Greška", description: e?.message || "Greška pri kreiranju kategorije", status: "error" });
												}
											}}
											borderRadius="md"
										>
											Kreiraj kategoriju
										</Button>
										<Button
											variant="outline"
											onClick={() => {
												if (selectedUrls.length === 0) {
													toast({ title: "Greška", description: "Izaberite slike iz Cloudinary pregleda", status: "warning" });
													return;
												}
												setCategoryImages((prev) => [...prev, ...selectedUrls]);
												setSelected({});
												toast({ title: "Dodato", description: `${selectedUrls.length} slika dodato u kategoriju`, status: "success" });
											}}
											isDisabled={selectedUrls.length === 0}
											borderRadius="md"
										>
											Dodaj selektovane slike ({selectedUrls.length})
										</Button>
									</HStack>
									{categoryImages.length > 0 && (
										<VStack spacing={2} align="stretch">
											<Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} fontWeight="semibold">
												Slike u kategoriji ({categoryImages.length}):
											</Text>
											<SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
												{categoryImages.map((url, idx) => (
													<Box key={`${url}-${idx}`} position="relative">
														<SafeImage src={url} alt={`Cat ${idx}`} width={200} height={150} style={{ width: "100%", height: "auto" }} />
														<VStack
															position="absolute"
															top="2"
															left="2"
															spacing={1}
														>
															<IconButton
																aria-label="Pomeri gore"
																icon={<FiArrowUp />}
																size="xs"
																colorScheme="blue"
																bg="whiteAlpha.900"
																_dark={{ bg: "gray.800" }}
																isDisabled={idx === 0}
																onClick={() => {
																	if (idx > 0) {
																		const newImages = [...categoryImages];
																		[newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
																		setCategoryImages(newImages);
																	}
																}}
															/>
															<IconButton
																aria-label="Pomeri dole"
																icon={<FiArrowDown />}
																size="xs"
																colorScheme="blue"
																bg="whiteAlpha.900"
																_dark={{ bg: "gray.800" }}
																isDisabled={idx === categoryImages.length - 1}
																onClick={() => {
																	if (idx < categoryImages.length - 1) {
																		const newImages = [...categoryImages];
																		[newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]];
																		setCategoryImages(newImages);
																	}
																}}
															/>
														</VStack>
														<IconButton
															aria-label="Ukloni"
															icon={<FiX />}
															size="xs"
															colorScheme="red"
															position="absolute"
															top="2"
															right="2"
															bg="whiteAlpha.900"
															_dark={{ bg: "gray.800" }}
															onClick={() => setCategoryImages((prev) => prev.filter((_, i) => i !== idx))}
														/>
													</Box>
												))}
											</SimpleGrid>
										</VStack>
									)}
								</VStack>
			</Card>

							<Divider />

							{/* Lista kategorija */}
							{categoriesLoading ? (
								<Flex justify="center" py={8}>
									<Spinner size="lg" color="teal.500" />
								</Flex>
							) : categories.length === 0 ? (
								<Box textAlign="center" py={12} color="gray.500">
									<Icon as={FiFolder} boxSize={16} mb={4} />
									<Text fontSize="lg">Nema kategorija</Text>
									<Text fontSize="sm" mt={2}>Kreirajte novu kategoriju gore</Text>
								</Box>
							) : (
								<Accordion allowMultiple defaultIndex={[]}>
									{categories.map((category) => (
										<AccordionItem key={category._id} mb={4} borderWidth="1px" borderColor="gray.200" _dark={{ borderColor: "gray.700" }} borderRadius="md" overflow="hidden">
											<AccordionButton
												bg="gray.50"
												_dark={{ bg: "gray.800" }}
												py={4}
												px={4}
												_hover={{ bg: "gray.100", _dark: { bg: "gray.700" } }}
											>
												<Box flex="1" textAlign="left">
													<Flex justify="space-between" align="center" flexWrap="wrap" gap={4} w="100%">
														<VStack align="start" spacing={1}>
															<Heading size="sm" color="gray.800" _dark={{ color: "white" }}>
																{category.name}
															</Heading>
															{category.description && (
																<Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
																	{category.description}
																</Text>
															)}
															<Badge colorScheme="teal">{category.imageUrls.length} slika</Badge>
														</VStack>
													</Flex>
												</Box>
												<AccordionIcon />
											</AccordionButton>
											<AccordionPanel pb={4} px={4}>
												<VStack spacing={4} align="stretch">
													<HStack justify="flex-end">
														<Button
															size="sm"
															variant="outline"
															leftIcon={<FiEdit2 />}
															onClick={() => {
																setEditingCategory(category);
																setNewCategoryName(category.name);
																setNewCategoryDesc(category.description || "");
																setCategoryImages(category.imageUrls);
															}}
															borderRadius="md"
														>
															Izmeni
														</Button>
														<Button
															size="sm"
															variant="outline"
															colorScheme="red"
															leftIcon={<FiTrash />}
															onClick={async () => {
																if (!confirm(`Da li ste sigurni da želite da obrišete kategoriju "${category.name}"?`)) return;
																try {
																	const res = await fetch(`/api/categories?id=${category._id}`, { method: "DELETE" });
																	if (!res.ok) throw new Error("Greška pri brisanju");
																	loadCategories();
																	toast({ title: "Uspešno", description: "Kategorija je obrisana", status: "success" });
																} catch (e: any) {
																	toast({ title: "Greška", description: e?.message, status: "error" });
																}
															}}
															borderRadius="md"
														>
															Obriši
														</Button>
													</HStack>
													{category.imageUrls.length > 0 ? (
														<SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
															{category.imageUrls.map((url, idx) => (
																<Box key={idx} position="relative">
																	<SafeImage src={url} alt={`${category.name} ${idx}`} width={200} height={150} style={{ width: "100%", height: "auto" }} />
																</Box>
						))}
						</SimpleGrid>
													) : (
														<Box textAlign="center" py={4} color="gray.500">
															<Text fontSize="sm">Nema slika u ovoj kategoriji</Text>
														</Box>
													)}
												</VStack>
											</AccordionPanel>
										</AccordionItem>
									))}
								</Accordion>
							)}

							{/* Edit Modal */}
							{editingCategory && (
								<Card variant="outline" p={4} bg="blue.50" _dark={{ bg: "blue.900" }}>
									<VStack spacing={4} align="stretch">
										<Flex justify="space-between" align="center">
											<Heading size="sm">Izmena kategorije: {editingCategory.name}</Heading>
											<Button size="sm" variant="ghost" onClick={() => {
												setEditingCategory(null);
												setNewCategoryName("");
												setNewCategoryDesc("");
												setCategoryImages([]);
											}}>
												<FiX />
											</Button>
										</Flex>
										<InputGroup>
											<InputLeftElement pointerEvents="none">
												<Icon as={FiFolder} color="gray.400" />
											</InputLeftElement>
											<Input
												placeholder="Naziv kategorije"
												value={newCategoryName}
												onChange={(e) => setNewCategoryName(e.target.value)}
												borderRadius="md"
											/>
										</InputGroup>
										<Input
											placeholder="Opis kategorije (opciono)"
											value={newCategoryDesc}
											onChange={(e) => setNewCategoryDesc(e.target.value)}
											borderRadius="md"
										/>
										<HStack>
											<Button
												colorScheme="blue"
												leftIcon={<FiSave />}
												onClick={async () => {
													try {
														const res = await fetch("/api/categories", {
															method: "PUT",
															headers: { "Content-Type": "application/json" },
															body: JSON.stringify({
																id: editingCategory._id,
																name: newCategoryName,
																description: newCategoryDesc,
																imageUrls: categoryImages,
																order: editingCategory.order,
															}),
														});
														if (!res.ok) throw new Error("Greška pri ažuriranju");
														setEditingCategory(null);
														setNewCategoryName("");
														setNewCategoryDesc("");
														setCategoryImages([]);
														loadCategories();
														toast({ title: "Uspešno", description: "Kategorija je ažurirana", status: "success" });
													} catch (e: any) {
														toast({ title: "Greška", description: e?.message, status: "error" });
													}
												}}
												borderRadius="md"
											>
												Sačuvaj izmene
											</Button>
											<Button
												variant="outline"
												onClick={() => {
													if (selectedUrls.length === 0) {
														toast({ title: "Greška", description: "Izaberite slike iz Cloudinary pregleda", status: "warning" });
														return;
													}
													setCategoryImages((prev) => [...prev, ...selectedUrls]);
													setSelected({});
													toast({ title: "Dodato", description: `${selectedUrls.length} slika dodato`, status: "success" });
												}}
												isDisabled={selectedUrls.length === 0}
												borderRadius="md"
											>
												Dodaj selektovane ({selectedUrls.length})
											</Button>
										</HStack>
										{categoryImages.length > 0 && (
											<VStack spacing={2} align="stretch">
												<Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }} fontWeight="semibold">
													Slike u kategoriji ({categoryImages.length}):
												</Text>
												<SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
													{categoryImages.map((url, idx) => (
														<Box key={`${url}-${idx}`} position="relative">
															<SafeImage src={url} alt={`Edit ${idx}`} width={200} height={150} style={{ width: "100%", height: "auto" }} />
															<VStack
																position="absolute"
																top="2"
																left="2"
																spacing={1}
															>
																<IconButton
																	aria-label="Pomeri gore"
																	icon={<FiArrowUp />}
																	size="xs"
																	colorScheme="blue"
																	bg="whiteAlpha.900"
																	_dark={{ bg: "gray.800" }}
																	isDisabled={idx === 0}
																	onClick={() => {
																		if (idx > 0) {
																			const newImages = [...categoryImages];
																			[newImages[idx - 1], newImages[idx]] = [newImages[idx], newImages[idx - 1]];
																			setCategoryImages(newImages);
																		}
																	}}
																/>
																<IconButton
																	aria-label="Pomeri dole"
																	icon={<FiArrowDown />}
																	size="xs"
																	colorScheme="blue"
																	bg="whiteAlpha.900"
																	_dark={{ bg: "gray.800" }}
																	isDisabled={idx === categoryImages.length - 1}
																	onClick={() => {
																		if (idx < categoryImages.length - 1) {
																			const newImages = [...categoryImages];
																			[newImages[idx], newImages[idx + 1]] = [newImages[idx + 1], newImages[idx]];
																			setCategoryImages(newImages);
									}
																	}}
																/>
															</VStack>
															<IconButton
																aria-label="Ukloni"
																icon={<FiX />}
																size="xs"
																colorScheme="red"
																position="absolute"
																top="2"
																right="2"
																bg="whiteAlpha.900"
																_dark={{ bg: "gray.800" }}
																onClick={() => setCategoryImages((prev) => prev.filter((_, i) => i !== idx))}
															/>
														</Box>
													))}
												</SimpleGrid>
											</VStack>
										)}
									</VStack>
								</Card>
							)}
						</Stack>
						</AccordionPanel>
					</AccordionItem>


					{/* Recenzije */}
					<AccordionItem mb={6} borderRadius="xl" overflow="hidden" boxShadow="lg" bg="white" _dark={{ bg: "gray.800" }}>
						<AccordionButton
							bg="yellow.50"
							_dark={{ bg: "yellow.900" }}
							py={4}
							px={6}
							_hover={{ bg: "yellow.100", _dark: { bg: "yellow.800" } }}
						>
							<Box flex="1" textAlign="left">
								<Flex justify="space-between" align="center" flexWrap="wrap" gap={4} w="100%">
									<Heading size="md" color="yellow.700" _dark={{ color: "yellow.200" }}>
										Recenzije
									</Heading>
									<Badge colorScheme="yellow" fontSize="md" px={3} py={1} borderRadius="full">
										{reviews.length}
									</Badge>
								</Flex>
							</Box>
							<AccordionIcon />
						</AccordionButton>
						<AccordionPanel pb={6} px={6}>
							<Stack spacing={6}>
								<HStack justify="space-between" flexWrap="wrap" spacing={4}>
									<Text color="gray.500" _dark={{ color: "gray.400" }}>
										Upravljaj recenzijama – brisanje je dostupno, tekst se ne edituje.
									</Text>
									<Button leftIcon={<FiRefreshCw />} variant="outline" onClick={loadReviews} isLoading={reviewsLoading}>
										Osvježi recenzije
									</Button>
								</HStack>
								{reviewsLoading ? (
									<Flex justify="center" py={10}>
										<Spinner size="lg" color="yellow.500" />
									</Flex>
								) : reviews.length === 0 ? (
									<Box textAlign="center" py={8} color="gray.500">
										<Text fontSize="md">Trenutno nema recenzija.</Text>
									</Box>
								) : (
									<Stack spacing={4}>
										{reviews.map((review) => (
											<Card key={review._id} variant="outline" p={{ base: 4, md: 5 }}>
												<Flex justify="space-between" align="flex-start" gap={4} flexDir={{ base: "column", md: "row" }}>
													<VStack align="flex-start" spacing={2} flex="1">
														<HStack spacing={3}>
															<Text fontWeight="600">{review.authorName}</Text>
															<Badge colorScheme="yellow">Ocena {review.rating}/5</Badge>
														</HStack>
														<Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }} lineHeight="1.6">
															{review.text}
														</Text>
														{review.createdAt && (
															<Text fontSize="xs" color="gray.500">
																{new Date(review.createdAt).toLocaleDateString("sr-RS")}
															</Text>
														)}
													</VStack>
													<Button
														leftIcon={<FiTrash />}
														colorScheme="red"
														variant="outline"
														onClick={() => handleDeleteReview(review._id)}
														isLoading={deletingReviewId === review._id}
													>
														Obriši
													</Button>
												</Flex>
											</Card>
										))}
									</Stack>
								)}
							</Stack>
						</AccordionPanel>
					</AccordionItem>
				</Accordion>

		</Container>
		</Box>
	);
}
