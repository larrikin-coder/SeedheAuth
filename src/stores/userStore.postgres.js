import pkg from "pg";
const { Pool } = pkg;

export class PostgresUserStore {
  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async getUser(username) {
    const res = await this.pool.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);
    return res.rows[0] || null;
  }

  async saveUser(user) {
    await this.pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [user.username, user.password]
    );
  }
}
