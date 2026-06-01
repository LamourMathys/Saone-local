require("dotenv").config();
const bcrypt = require("bcrypt");
const pool = require("./db");

const seed = async () => {
  await pool.query(
    "TRUNCATE users, categories, producers, products, orders, order_items, favorites, events RESTART IDENTITY CASCADE",
  );

  await pool.query(
    "INSERT INTO categories (name) VALUES ($1), ($2), ($3), ($4), ($5), ($6) ON CONFLICT (name) DO NOTHING",
    ["Pain", "Vin", "Légumes", "Œufs", "fruits", "Poissons"],
  );

  await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, role, provider)
    VALUES 
    ($1, $2, $3, $4, $5, $6),
    ($7, $8, $9, $10, $11, $12),
    ($13, $14, $15, $16, $17, $18),
    ($19, $20, $21, $22, $23, $24)
    ON CONFLICT (email) DO NOTHING`,
    [
      "Mathys",
      "nom",
      "mathys@saonelocal.fr",
      await bcrypt.hash("MDPsecurisemathys", 10),
      "admin",
      "local",
      "Giacomo",
      "nom",
      "giacomo@saonelocal.fr",
      await bcrypt.hash("MDPsecurisegiacomo", 10),
      "admin",
      "local",
      "Romane",
      "nom",
      "romane@saonelocal.fr",
      await bcrypt.hash("MDPsecuriseromane", 10),
      "producteur",
      "local",
      "Alexandra",
      "nom",
      "alexandra@saonelocal.fr",
      await bcrypt.hash("MDPsecurisealexandra", 10),
      "client",
      "local",
    ],
  );

  await pool.query(
    `INSERT INTO producers (user_id, producer_name, description, producer_photo, shop_location)
   VALUES ($1, $2, $3, $4, $5)`,
    [
      1,
      "Marée Océane",
      "Producteur local de poissons",
      "https://exemple.com/photo.jpg",
      "12 rue du Marché, Chalon-sur-Saône",
    ],
  );

  await pool.query(
    `INSERT INTO products (producer_id, category_id, product_name, description, price, unit, stock, product_photo)
 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      1,
      6,
      "Saumon",
      "Saumon frais.",
      12,
      "kg",
      50,
      "https://exemple.com/photo.jpg",
    ],
  );

  await pool.query(
    `INSERT INTO events (title, location, event_date, description)
 VALUES ($1, $2, $3, $4)`,
    [
      "Arrivée de TUNG TUNG TUNG SAHUR",
      "67 rue du soixante-sept, Woippy",
      "2067-10-15",
      "Tung Tung Tung Sahur redescendra du paradis.",
    ],
  );

  console.log("Seeder was executed");
  pool.end();
};

seed();
