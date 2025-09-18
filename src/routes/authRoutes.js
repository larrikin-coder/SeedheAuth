import express from "express";

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

  return router;
}
