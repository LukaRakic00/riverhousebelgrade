"use client";

import { Box, Button, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFoundPage() {
	return (
		<Box minH="70vh" display="flex" alignItems="center" justifyContent="center" textAlign="center" p={8}>
			<Box>
				<Heading size="2xl" mb={2}>404</Heading>
				<Text color="muted" mb={6}>Stranica nije pronađena.</Text>
				<Button as={Link} href="/" colorScheme="purple">Nazad na početnu</Button>
			</Box>
		</Box>
	);
}

