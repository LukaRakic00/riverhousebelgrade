"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { Box } from "@chakra-ui/react";

// Koristimo PNG fallback umesto SVG-a jer Next.js Image ne podržava SVG bez dangerouslyAllowSVG
const FALLBACK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23e2e8f0' width='800' height='600'/%3E%3Ctext fill='%234a5568' font-family='sans-serif' font-size='20' dy='10.5' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage not found%3C/text%3E%3C/svg%3E";

export function SafeImage(props: ImageProps) {
	const { src, alt, onError, ...rest } = props;
	const [imgSrc, setImgSrc] = useState<string>(typeof src === "string" ? src : (src as any).src || "");
	const [hasError, setHasError] = useState(false);

	// Ako nema src ili je došlo do greške, prikaži placeholder
	if (!imgSrc || hasError) {
		const { width, height, style, ...boxProps } = rest as any;
		return (
			<Box
				{...boxProps}
				as="div"
				bg="gray.200"
				_dark={{ bg: "gray.700" }}
				display="flex"
				alignItems="center"
				justifyContent="center"
				color="gray.500"
				fontSize="sm"
				minH={height || 200}
				minW={width || 200}
				style={style}
			>
				Image not found
			</Box>
		);
	}

	return (
		<Image
			{...rest}
			alt={alt}
			src={imgSrc}
			onError={(e) => {
				setHasError(true);
				if (onError) onError(e as any);
			}}
		/>
	);
}


