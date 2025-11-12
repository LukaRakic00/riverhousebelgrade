import type { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./(marketing)/providers";
import { MarketingLayout as TemplateLayout } from "#components/layout/marketing-layout";

export const metadata: Metadata = {
	title: process.env.NEXT_PUBLIC_SITE_NAME || "River House Belgrade",
	description: "River House Belgrade - zvanična prezentacija",
	icons: {
		icon: [
			{ url: "/static/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/static/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/static/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
			{ url: "/static/favicons/favicon.ico", sizes: "any" },
		],
		apple: [
			{ url: "/static/favicons/apple-icon.png", sizes: "180x180", type: "image/png" },
		],
	},
	manifest: "/static/favicons/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="sr">
			<body>
				<Script
					id="chakra-color-mode"
					strategy="beforeInteractive"
					dangerouslySetInnerHTML={{
						__html: `
							(function() {
								try {
									var mode = localStorage.getItem('chakra-ui-color-mode') || 'dark';
									document.documentElement.setAttribute('data-theme', mode);
								} catch (e) {}
							})();
						`,
					}}
				/>
				<Providers>
					<TemplateLayout>{children}</TemplateLayout>
				</Providers>
			</body>
		</html>
	);
}

