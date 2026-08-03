import dotenv from "dotenv";
dotenv.config();

import connectDB from "./lib/db.js";
import { app } from "./app.js";
import connectCloudinary from "./lib/cloudinary.js";

const startServer = async () => {
  try {
    await connectDB();

    await connectCloudinary();
    console.log("✅ Cloudinary Connected");

    const port = process.env.PORT || 3000; // Fallback to 3000 if PORT is not set
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit process on failure
  }
};

// Start the server
startServer();

// Export for Vercel
export default app;
