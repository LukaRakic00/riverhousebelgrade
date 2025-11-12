import { Schema, models, model } from "mongoose";

export interface IReview {
	authorName: string;
	rating: number; // 1-5
	text: string;
	imageUrl?: string; // Opciono - slika autora ili lokacije
	featured?: boolean; // Da li je recenzija istaknuta (za prikaz na landing page-u)
	order?: number; // Redosled prikaza
	approved?: boolean; // Da li je recenzija odobrena (za moderaciju)
	createdAt?: Date;
	updatedAt?: Date;
}

const ReviewSchema = new Schema<IReview>(
	{
		authorName: { type: String, required: true },
		rating: { type: Number, required: true, min: 1, max: 5 },
		text: { type: String, required: true },
		imageUrl: { type: String },
		featured: { type: Boolean, default: false },
		order: { type: Number, default: 0 },
		approved: { type: Boolean, default: true },
	},
	{ timestamps: true }
);

export const Review = models.Review || model<IReview>("Review", ReviewSchema);

