import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

const UserModel = mongoose.model("User", userSchema);

export class MongoUserStore {
  async getUser(username) {
    return await UserModel.findOne({ username });
  }

  async saveUser(user) {
    const newUser = new UserModel(user);
    await newUser.save();
  }
}
