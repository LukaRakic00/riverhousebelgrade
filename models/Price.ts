import mongoose, { Schema, Document } from "mongoose";

export interface IIncludedItem {
	icon: string; // Emoji ili ikona
	title: string;
	description?: string;
}

export interface IPrice extends Document {
	price: number;
	description?: string;
	includedItems: string[]; // Stara lista za kompatibilnost
	includedItemsDetails: IIncludedItem[]; // Nova detaljna lista
	additionalBenefits?: string; // Dodatne pogodnosti (Wi-Fi • Peškiri • etc.)
	note?: string; // Napomena
	createdAt: Date;
	updatedAt: Date;
}

const IncludedItemSchema = new Schema<IIncludedItem>({
	icon: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String },
}, { _id: false });

const PriceSchema = new Schema<IPrice>(
	{
		price: { type: Number, required: true },
		description: { type: String },
		includedItems: { type: [String], default: [] },
		includedItemsDetails: { type: [IncludedItemSchema], default: [] },
		additionalBenefits: { type: String },
		note: { type: String },
	},
	{
		timestamps: true,
	}
);

export const Price = mongoose.models.Price || mongoose.model<IPrice>("Price", PriceSchema);

