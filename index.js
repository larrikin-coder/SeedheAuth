// index.js
import { AuthService } from "./src/auth/authService.js";
import { authRoutes } from "./src/routes/authRoutes.js";
import { getUserStore } from "./config/dbConfig.js";
import { setupPassport } from "./src/auth/passportConfig.js";

export async function initAuth() {
  setupPassport();
  const userStore = await getUserStore();
  const authService = new AuthService(userStore);
  return { authService, authRoutes: authRoutes(authService) };
}
