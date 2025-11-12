import { Schema, models, model } from "mongoose";

export interface ISiteConfig {
	heroImageUrl: string;
	logoUrl?: string;
	featuredImages: string[]; // 6 udarnih slika za landing page
	updatedAt?: Date;
	createdAt?: Date;
}

const SiteConfigSchema = new Schema<ISiteConfig>(
	{
		heroImageUrl: { type: String, required: true },
		logoUrl: { type: String, required: false },
		featuredImages: { type: [String], required: true, default: [] }
	},
	{ timestamps: true }
);

export const SiteConfig = models.SiteConfig || model<ISiteConfig>("SiteConfig", SiteConfigSchema);


