import express from "express";
import passport from "passport";

export function authRoutes(authService) {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    try {
      const result = await authService.registerUser(
        req.body.username,
        req.body.password
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const result = await authService.loginUser(
        req.body.username,
        req.body.password
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get("/profile", authService.authenticateToken, (req, res) => {
    res.json({ message: `Welcome ${req.user.username}!` });
  });

  // === Google OAuth ===
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/oauth/callback/google",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/auth/failure",
    }),
    (req, res) => {
      res.json({ token: req.user.token, profile: req.user.profile });
    }
  );

  // === GitHub OAuth ===
  router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );

  router.get(
    "/oauth/callback/github",
    passport.authenticate("github", {
      session: false,
      failureRedirect: "/auth/failure",
    }),
    (req, res) => {
      res.json({ token: req.user.token, profile: req.user.profile });
    }
  );

  router.get("/failure", (req, res) =>
    res.status(401).json({ error: "OAuth failed" })
  );

  return router;
}
