import type { ReactNode } from "react";
import { Providers } from "./providers";
import { MarketingLayout as TemplateLayout } from "#components/layout/marketing-layout";

export default function MarketingLayout({ children }: { children: ReactNode }) {
	return (
		<Providers>
			<TemplateLayout>{children}</TemplateLayout>
		</Providers>
	);
}

