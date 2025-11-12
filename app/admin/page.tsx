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
} from "@chakra-ui/react";
import { FiLogOut, FiRefreshCw, FiSave, FiTrash, FiUpload } from "react-icons/fi";

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
			toast({ title: "Sačuvano", status: "success" });
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
			if (data?.urls) setCloudUrls(data.urls);
		} finally {
			setCloudLoading(false);
		}
	};

	const selectedUrls = useMemo(() => Object.keys(selected).filter((u) => selected[u]), [selected]);

	const addSelectedToGallery = () => {
		setGalleryEdits((prev) => {
			const set = new Set(prev);
			for (const u of selectedUrls) set.add(u);
			return Array.from(set);
		});
		toast({ title: `Dodata ${selectedUrls.length} iz Cloudinary`, status: "info" });
	};

	const removeFromGallery = (url: string) => {
		setGalleryEdits((prev) => prev.filter((u) => u !== url));
	};

	return (
		<Container maxW="container.xl" py={8}>
			<Flex justify="space-between" align="center" mb={6}>
				<Heading size="lg">Admin panel — River House</Heading>
				<Button variant="outline" leftIcon={<FiLogOut />} onClick={onLogout}>Odjava</Button>
			</Flex>

			<Card mb={6}>
				<CardHeader>
					<Heading size="md">Hero slika</Heading>
				</CardHeader>
				<CardBody>
					<Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6} alignItems="start">
						<Box borderWidth="1px" borderRadius="md" overflow="hidden">
							{heroUrlEdit ? (
								<SafeImage src={heroUrlEdit} alt="Hero" width={1200} height={800} style={{ width: "100%", height: "auto" }} />
							) : (
								<Box p={6} color="muted">Nema postavljene hero slike.</Box>
							)}
						</Box>
						<Stack spacing={3}>
							<Input placeholder="https://..." value={heroUrlEdit} onChange={(e) => setHeroUrlEdit(e.target.value)} />
							<Button colorScheme="purple" leftIcon={<FiSave />} isLoading={loading} onClick={() => config && saveConfig({ ...config, heroImageUrl: heroUrlEdit })}>
								Sačuvaj hero URL
							</Button>
						</Stack>
					</Grid>
				</CardBody>
			</Card>

			<Card mb={6}>
				<CardHeader>
					<Heading size="md">Cloudinary pregled</Heading>
				</CardHeader>
				<CardBody>
					<Stack spacing={3}>
						<HStack>
							<Input placeholder="cloudinary folder" value={cloudFolder} onChange={(e) => setCloudFolder(e.target.value)} />
							<Button leftIcon={<FiRefreshCw />} onClick={loadCloudinary} isLoading={cloudLoading}>Učitaj</Button>
							<Button variant="outline" onClick={() => setSelected({})}>Poništi selekciju</Button>
							<Badge colorScheme="purple">selektovano: {selectedUrls.length}</Badge>
							<Button colorScheme="purple" onClick={addSelectedToGallery} isDisabled={!selectedUrls.length}>Dodaj u galeriju</Button>
						</HStack>
						{cloudLoading ? (
							<Spinner />
						) : (
							<SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={3}>
								{cloudUrls.map((u) => (
									<GridItem key={u} borderWidth="1px" borderRadius="md" overflow="hidden" position="relative">
										<Box cursor="pointer" onClick={() => setSelected((s) => ({ ...s, [u]: !s[u] }))}>
											<SafeImage src={u} alt="cloud" width={400} height={300} style={{ width: "100%", height: "auto" }} />
										</Box>
										<Box position="absolute" top="2" right="2">
											<Badge colorScheme={selected[u] ? "purple" : "gray"}>{selected[u] ? "Izabrano" : ""}</Badge>
										</Box>
									</GridItem>
								))}
							</SimpleGrid>
						)}
					</Stack>
				</CardBody>
			</Card>

			<Card>
				<CardHeader>
					<Heading size="md">Galerija (upis u bazu)</Heading>
				</CardHeader>
				<CardBody>
					<Stack spacing={3}>
						<SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={3}>
							{galleryEdits.map((u) => (
								<GridItem key={u} borderWidth="1px" borderRadius="md" overflow="hidden">
									<SafeImage src={u} alt="g" width={400} height={300} style={{ width: "100%", height: "auto" }} />
									<Button w="full" size="sm" variant="ghost" leftIcon={<FiTrash />} onClick={() => removeFromGallery(u)}>Ukloni</Button>
								</GridItem>
						))}
						</SimpleGrid>
						<Divider />
						<Stack direction={{ base: "column", md: "row" }}>
							<Input placeholder="Dodaj URL" onKeyDown={(e) => {
								if (e.key === "Enter") {
									const v = (e.target as HTMLInputElement).value.trim();
									if (v) {
										setGalleryEdits((prev) => Array.from(new Set([...prev, v])));
										(e.target as HTMLInputElement).value = "";
									}
								}
							}} />
							<Button variant="outline" leftIcon={<FiUpload />} onClick={() => {
								const inp = document.querySelector<HTMLInputElement>("#hidden-file-inp");
								inp?.click();
							}}>Upload (opciono)</Button>
							<input id="hidden-file-inp" type="file" accept="image/*" multiple style={{ display: "none" }} onChange={async (e) => {
								const files = e.target.files;
								if (!files) return;
								const uploaded: string[] = [];
								for (let i = 0; i < files.length; i++) {
									const f = files.item(i);
									if (!f) continue;
									const form = new FormData();
									form.append("file", f);
									const res = await fetch("/api/upload", { method: "POST", body: form });
									if (res.ok) {
										const d = await res.json();
										if (d?.url) uploaded.push(d.url);
									}
								}
								if (uploaded.length) setGalleryEdits((prev) => Array.from(new Set([...prev, ...uploaded])));
							}} />
						</Stack>
						<HStack>
							<Button colorScheme="purple" leftIcon={<FiSave />} isLoading={loading} onClick={() => config && saveConfig({ ...config, heroImageUrl: heroUrlEdit, galleryImageUrls: galleryEdits })}>
								Sačuvaj promene
							</Button>
							<Text color="muted">Upisuje linkove u MongoDB (`SiteConfig`).</Text>
						</HStack>
					</Stack>
				</CardBody>
			</Card>
		</Container>
	);
}


