import mongoose from "mongoose";
import dns from "dns";

// function to connect to the mongoDB database

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected");
        });
        await mongoose.connect(`${process.env.MONGODB_URI}`);
    } catch (error) {
        // If connection failed due to DNS resolution errors, fallback to Google/Cloudflare public DNS
        if (error.message && (error.message.includes("ENOTFOUND") || error.message.includes("EAI_AGAIN"))) {
            console.warn("⚠️ MongoDB DNS resolution failed. Retrying with Google/Cloudflare public DNS servers...");
            try {
                dns.setServers(["8.8.8.8", "1.1.1.1"]);
                await mongoose.connect(`${process.env.MONGODB_URI}`);
                return;
            } catch (fallbackError) {
                console.error(`Fallback DNS Connection Error: ${fallbackError.message}`);
            }
        }
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;