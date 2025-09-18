import { MemoryUserStore } from "../src/stores/userStore.memory.js";
import { MongoUserStore } from "../src/stores/userStore.mongo.js";
import { PostgresUserStore } from "../src/stores/userStore.postgres.js";
import mongoose from "mongoose";

export async function getUserStore() {
  const dbType = process.env.DB_TYPE || "memory";

  if (dbType === "mongo") {
    await mongoose.connect(process.env.MONGO_URI);
    return new MongoUserStore();
  }

  if (dbType === "postgres") {
    return new PostgresUserStore();
  }

  return new MemoryUserStore(); // default
}
