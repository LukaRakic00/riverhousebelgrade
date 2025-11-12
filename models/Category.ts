import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
	name: string;
	description?: string;
	imageUrls: string[];
	order: number;
	createdAt: Date;
	updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
	{
		name: { type: String, required: true },
		description: { type: String },
		imageUrls: { type: [String], required: true, default: [] },
		order: { type: Number, required: true, default: 0 },
	},
	{
		timestamps: true,
	}
);

export const Category = mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

