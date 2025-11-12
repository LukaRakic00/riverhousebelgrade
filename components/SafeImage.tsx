"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK = "https://placehold.co/800x600?text=Image+not+found";

export function SafeImage(props: ImageProps) {
	const { src, alt, onError, ...rest } = props;
	const [imgSrc, setImgSrc] = useState<string>(typeof src === "string" ? src : (src as any).src || FALLBACK);
	return (
		<Image
			{...rest}
			alt={alt}
			src={imgSrc}
			onError={(e) => {
				if (imgSrc !== FALLBACK) {
					setImgSrc(FALLBACK);
				}
				if (onError) onError(e as any);
			}}
		/>
	);
}


