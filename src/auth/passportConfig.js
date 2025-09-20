import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET){
  console.log("JWT_SECRET not available");
}

// Common callback after successful OAuth login
function oauthCallback(accessToken, refreshToken, profile, done) {
  // Instead of storing in DB here, we pass user data to `done`
  const payload = {
    id: profile.id,
    provider: profile.provider,
    name: profile.displayName,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  done(null, { token, profile });
}

export function setupPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL, 
      },
      oauthCallback
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL, 
      },
      oauthCallback
    )
  );

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));
}

