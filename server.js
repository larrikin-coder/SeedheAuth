import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { AuthService } from "./src/auth/authService.js";
import { authRoutes } from "./src/routes/authRoutes.js";
import { getUserStore } from "./config/dbConfig.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const startServer = async () => {
  const userStore = await getUserStore();
  const authService = new AuthService(userStore);

  app.use("/auth", authRoutes(authService));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
};

startServer();
