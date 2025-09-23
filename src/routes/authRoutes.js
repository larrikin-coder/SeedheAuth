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
      // Set token in HttpOnly cookie
      res
        .cookie("token", result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600 * 1000,
        })
        .json({ message: "Logged in" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get("/profile", authService.authenticateToken, (req, res) => {
    res.json({ user:req.user});
  });

  // === Google OAuth ===
  router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", {
      session: false,
      failureRedirect: "/auth/failure",
    }),
    (req, res) => {
      // set HttpOnly cookie and redirect to dashboard
      res
        .cookie("token", req.user.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600 * 1000,
        })
        .redirect("/dashboard");
    }
  );

  // === GitHub OAuth ===
  router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
  );

  router.get(
    "/github/callback",
    passport.authenticate("github", {
      session: false,
      failureRedirect: "/auth/failure",
    }),
    (req, res) => {
      res
        .cookie("token", req.user.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 3600 * 1000,
        })
        .redirect("/dashboard");
    }
  );

  router.get("/failure", (req, res) =>
    res.status(401).json({ error: "SeedheAuth failed" })
  );


  
  return router;
}
