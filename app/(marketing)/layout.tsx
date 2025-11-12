import type { ReactNode } from "react";
import { Providers } from "./providers";
import { MarketingLayout as TemplateLayout } from "#components/layout/marketing-layout";

export default function MarketingLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="sr">
			<body>
				<Providers>
					<TemplateLayout>{children}</TemplateLayout>
				</Providers>
			</body>
		</html>
	);
}

