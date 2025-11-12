"use client";

import { Box, Button, Heading, Text } from "@chakra-ui/react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
	return (
		<Box minH="70vh" display="flex" alignItems="center" justifyContent="center" textAlign="center" p={8}>
			<Box>
				<Heading size="lg" mb={2}>Došlo je do greške</Heading>
				<Text color="muted" mb={6}>{error.message || "Nepoznata greška."}</Text>
				<Button onClick={reset} colorScheme="purple">Pokušaj ponovo</Button>
			</Box>
		</Box>
	);
}

