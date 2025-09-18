export class MemoryUserStore {
  constructor() {
    this.users = new Map();
  }

  async getUser(username) {
    return this.users.get(username) || null;
  }

  async saveUser(user) {
    this.users.set(user.username, user);
  }
}
z