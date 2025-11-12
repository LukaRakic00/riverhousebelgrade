import { Schema, models, model } from "mongoose";

export interface ISiteConfig {
	heroImageUrl: string;
	logoUrl?: string;
	galleryImageUrls: string[];
	updatedAt?: Date;
	createdAt?: Date;
}

const SiteConfigSchema = new Schema<ISiteConfig>(
	{
		heroImageUrl: { type: String, required: true },
		logoUrl: { type: String, required: false },
		galleryImageUrls: { type: [String], required: true, default: [] }
	},
	{ timestamps: true }
);

export const SiteConfig = models.SiteConfig || model<ISiteConfig>("SiteConfig", SiteConfigSchema);


