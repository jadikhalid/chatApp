import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

const startServer = async () => {
  try {
    // 1. On attend la connexion à la DB
    await connectDB();
    console.log("✅ Connexion à MongoDB réussie");

    // 2. On lance l'écoute du serveur
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur : http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Échec du démarrage :", error.message);
    process.exit(1); // On arrête tout si la DB est inaccessible
  }
};

startServer();
export default app;
