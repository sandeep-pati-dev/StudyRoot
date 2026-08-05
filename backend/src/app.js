import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Initialize express
const app = express();

// Middlewares
// CORS Configuration supporting multiple origins and trailing slashes
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://study-root-murex.vercel.app" // ✅ Added user's deployed Vercel domain
];

if (process.env.FRONTEND_URL) {
  const urls = process.env.FRONTEND_URL.split(",").map(url => url.trim().replace(/\/$/, ""));
  allowedOrigins.push(...urls);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      
      const sanitizedOrigin = origin.replace(/\/$/, "");
      
      // ✅ Allow if in whitelist or matches any Vercel deployment subdomain (*.vercel.app)
      const isAllowed = allowedOrigins.includes(sanitizedOrigin) || /\.vercel\.app$/.test(sanitizedOrigin);
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`⚠️ CORS blocked for origin: ${origin}`);
        callback(null, false); // ✅ Return false instead of Error to avoid preflight 500 crash
      }
    },
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import routes
import authRoute from "./routes/auth.route.js";
import courseRoute from "./routes/courseRoutes.js";
import semesterRoute from "./routes/semesterRoutes.js";
import subjectRoute from "./routes/subjectRoutes.js";
import noteRoute from "./routes/noteRoutes.js";
import noteRatingRoute from "./routes/ratingRoutes.js";

import profileRoute from "./routes/profileRoutes.js";
import mcqRoutes from "./routes/mcqRoutes.js"
import dashboardRoute from "./routes/dashboardRoutes.js";
import summarizeRoutes from "./routes/summarizeRoutes.js";

import commentRoute from "./routes/commentRoutes.js";
import ratingRoute from "./routes/ratingRoutes.js";

// routes declaration
app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/semesters", semesterRoute);
app.use("/api/subjects", subjectRoute);
app.use("/api/notes", noteRoute);
app.use("/api/comments", commentRoute);

app.use("/api/ratings", ratingRoute);
app.use("/api/note-ratings", noteRatingRoute);

app.use("/api/profile", profileRoute);
app.use('/api/mcq', mcqRoutes);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/summarize", summarizeRoutes);

export { app };
