import type { ReactNode } from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./(marketing)/providers";
import { MarketingLayout as TemplateLayout } from "#components/layout/marketing-layout";

export const metadata: Metadata = {
	title: process.env.NEXT_PUBLIC_SITE_NAME || "River House Belgrade",
	description: "River House Belgrade - zvanična prezentacija",
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

