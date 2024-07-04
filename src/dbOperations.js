import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

export async function insertData(data) {
  for (const item of data) {
    const { name, age, address, gender } = item;
    if (!name || !age) {
      console.warn("Skipping invalid record:", item);
      continue;
    }

    const fullName = `${name.firstName} ${name.lastName}`;
    const addressData = address ? JSON.stringify(address) : null;

    await pool.query(
      `INSERT INTO users (name, age, address, gender) VALUES ($1, $2, $3, $4)`,
      [fullName, parseInt(age), addressData, gender]
    );
  }
}

export async function clearTable() {
  try {
    await pool.query("TRUNCATE TABLE users");
    console.log("Table content deleted successfully");
  } catch (err) {
    console.error("Error deleting table content:", err);
  }
}

export async function calculateAgeDistribution() {
  const result = await pool.query("SELECT age FROM users");
  const ages = result.rows.map((row) => row.age);

  const distribution = {
    "< 20": 0,
    "20 to 40": 0,
    "40 to 60": 0,
    "> 60": 0,
  };

  ages.forEach((age) => {
    if (age < 20) {
      distribution["< 20"]++;
    } else if (age <= 40) {
      distribution["20 to 40"]++;
    } else if (age <= 60) {
      distribution["40 to 60"]++;
    } else {
      distribution["> 60"]++;
    }
  });

  console.log("Age Distribution:");
  Object.keys(distribution).forEach((group) => {
    const percentage = ((distribution[group] / ages.length) * 100).toFixed(2);
    console.log(`${group}: ${percentage}%`);
  });
}
