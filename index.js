// index.js
import { AuthService } from "./src/auth/authService.js";
import { authRoutes } from "./src/routes/authRoutes.js";
import { getUserStore } from "./config/dbConfig.js";

export async function initAuth() {
  const userStore = await getUserStore();
  const authService = new AuthService(userStore);
  return { authService, authRoutes: authRoutes(authService) };
}
