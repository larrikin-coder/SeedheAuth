import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cookieSession from "cookie-session";

import { AuthService } from "./src/auth/authService.js";
import { authRoutes } from "./src/routes/authRoutes.js";
import { getUserStore } from "./config/dbConfig.js";
import { setupPassport } from "./src/auth/passportConfig.js";

dotenv.config();

const app = express();
app.use(express.json());

// Cookie session for OAuth
app.use(
  cookieSession({
    name: "session",
    keys: ["secretKey"], // replace in prod
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());
setupPassport();

const startServer = async () => {
  const userStore = await getUserStore();
  const authService = new AuthService(userStore);

  app.use("/auth", authRoutes(authService));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
};

startServer();
