import mongoose from "mongoose";
import { env } from "./env.js";

let isMongoConnected = false;

export async function connectDatabase() {
    if (!env.mongodbUri) {
        console.info(
            "[DB] MONGODB_URI not set — using persistent local JSON store (/server/data/twinflame-db.json)."
        );

        isMongoConnected = false;
        return false;
    }

    try {
        await mongoose.connect(env.mongodbUri, {
            serverSelectionTimeoutMS: 5000,
        });

        isMongoConnected = true;

        console.info("[DB] Connected to MongoDB Atlas.");

        return true;

    } catch (error) {
        isMongoConnected = false;

        console.warn(
            "[DB] MongoDB connection failed; falling back to persistent local JSON store:",
            error instanceof Error ? error.message : String(error)
        );

        return false;
    }
}

export function getIsMongoConnected() {
    return (
        isMongoConnected &&
        mongoose.connection.readyState === 1
    );
}