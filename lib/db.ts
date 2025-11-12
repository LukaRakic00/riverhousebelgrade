import mongoose from "mongoose";

const MONGODB_DB = process.env.MONGODB_DB as string | undefined;

declare global {
	// eslint-disable-next-line no-var
	var mongooseConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

let cached = global.mongooseConn;
if (!cached) {
	cached = global.mongooseConn = { conn: null, promise: null };
}

export async function connectToDatabase() {
	const uri = process.env.MONGODB_URI as string | undefined;
	if (!uri) {
		throw new Error("Missing MONGODB_URI environment variable. Please check your .env file.");
	}
	if (cached!.conn) return cached!.conn;
	if (!cached!.promise) {
		cached!.promise = mongoose.connect(uri, {
			dbName: MONGODB_DB || "riverhouse",
		}).catch((error) => {
			cached!.promise = null;
			throw error;
		});
	}
	try {
		cached!.conn = await cached!.promise;
		return cached!.conn;
	} catch (error: any) {
		cached!.promise = null;
		if (error?.message?.includes("IP") || error?.message?.includes("whitelist")) {
			throw new Error("MongoDB Atlas: Your IP address is not whitelisted. Please add your IP to MongoDB Atlas Network Access whitelist: https://www.mongodb.com/docs/atlas/security-whitelist/");
		}
		throw error;
	}
}


