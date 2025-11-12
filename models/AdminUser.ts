import { Schema, model, models } from "mongoose";

export interface IAdminUser {
	username: string;
	passwordHash: string;
	createdAt?: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
	{
		username: { type: String, required: true, unique: true },
		passwordHash: { type: String, required: true }
	},
	{ timestamps: { createdAt: true, updatedAt: false } }
);

export const AdminUser = models.AdminUser || model<IAdminUser>("AdminUser", AdminUserSchema);


