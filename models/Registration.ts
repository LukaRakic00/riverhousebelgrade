import mongoose, { Schema, models, model } from "mongoose";

export interface IRegistration extends mongoose.Document {
	fullName: string;
	email: string;
	phone?: string;
	message?: string;
	createdAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>(
	{
		fullName: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String },
		message: { type: String },
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

export const Registration = models.Registration || model<IRegistration>("Registration", RegistrationSchema);


