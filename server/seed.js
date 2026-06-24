require("dotenv").config();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const pool = require("./db");

const seed = async () => {
  try {
    const sqlPath = path.join(__dirname, "init.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    await pool.query(sql);

    await pool.query(
      "INSERT INTO categories (name) VALUES ($1), ($2), ($3), ($4), ($5), ($6), ($7) ON CONFLICT (name) DO NOTHING",
      ["Pain", "Vin", "Légumes", "Œufs", "fruits", "Fromages", "Miel"],
    );

    const usersResult = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role, provider)
    VALUES 
    ($1, $2, $3, $4, $5, $6),
    ($7, $8, $9, $10, $11, $12),
    ($13, $14, $15, $16, $17, $18),
    ($19, $20, $21, $22, $23, $24),
    ($25, $26, $27, $28, $29, $30),
    ($31, $32, $33, $34, $35, $36),
    ($37, $38, $39, $40, $41, $42)
    ON CONFLICT (email) DO NOTHING RETURNING id, email`,
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
        "producer",
        "local",
        "Alexandra",
        "nom",
        "alexandra@saonelocal.fr",
        await bcrypt.hash("MDPsecurisealexandra", 10),
        "client",
        "local",
        "Julien",
        "nom",
        "julien@saonelocal.fr",
        await bcrypt.hash("MDPsecurisejulien", 10),
        "producer",
        "local",
        "Camille",
        "nom",
        "camille@saonelocal.fr",
        await bcrypt.hash("MDPsecurisecamille", 10),
        "producer",
        "local",
        "Nicolas",
        "nom",
        "nicolas@saonelocal.fr",
        await bcrypt.hash("MDPsecurisenicolas", 10),
        "producer",
        "local",
      ],
    );

    const getUserId = async (email) => {
      const existing = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );
      if (existing.rows.length > 0) return existing.rows[0].id;
      const fromInsert = usersResult.rows.find((u) => u.email === email);
      return fromInsert ? fromInsert.id : null;
    };

    const romaneId = await getUserId("romane@saonelocal.fr");
    const julienId = await getUserId("julien@saonelocal.fr");
    const camilleId = await getUserId("camille@saonelocal.fr");
    const nicolasId = await getUserId("nicolas@saonelocal.fr");

    const upsertProducer = async (
      userId,
      businessName,
      shopLocation,
      siret,
    ) => {
      const result = await pool.query(
        `INSERT INTO producers (user_id, business_name, shop_location, siret)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id) DO NOTHING RETURNING id`,
        [userId, businessName, shopLocation, siret],
      );

      if (result.rows.length > 0) return result.rows[0].id;

      const existing = await pool.query(
        "SELECT id FROM producers WHERE user_id = $1",
        [userId],
      );
      return existing.rows[0].id;
    };

    const romaneProducerId = await upsertProducer(
      romaneId,
      "Les Jardins de Saône",
      "12 rue du Marché, Chalon-sur-Saône",
      "12345678900011",
    );

    const julienProducerId = await upsertProducer(
      julienId,
      "La Ferme du Verger",
      "8 chemin des Vergers, Saint-Rémy",
      "12345678900028",
    );

    const camilleProducerId = await upsertProducer(
      camilleId,
      "Fromagerie Camille",
      "3 place de l'Église, Givry",
      "12345678900035",
    );

    const nicolasProducerId = await upsertProducer(
      nicolasId,
      "Le Rucher de Bourgogne",
      "21 route des Vignes, Mercurey",
      "12345678900042",
    );

    const products = [
      [
        romaneProducerId,
        4,
        "Baguette tradition",
        "baguette tradition.",
        1.2,
        "unité",
        30,
        "/baguette.png",
      ],
      [
        romaneProducerId,
        3,
        "Carottes du potager",
        "Botte de carottes bio du jardin.",
        2.5,
        "botte",
        30,
        "/carottes.jpg",
      ],
      [
        romaneProducerId,
        2,
        "oeufs plein air",
        "Boite d'oeuf local.",
        3.3,
        "douzaine",
        20,
        "oeufs.jpg",
      ],
      [
        romaneProducerId,
        3,
        "Pain au Levain",
        "Pain traditionnel au levain.",
        1.5,
        "unité",
        25,
        "/pain-au-levain.avif",
      ],
      [
        julienProducerId,
        5,
        "pain aux céréales",
        "Pain traditionel au Céreales.",
        2,
        "unité",
        20,
        "/pain-aux-cereales.avif",
      ],
      [
        julienProducerId,
        5,
        "pain d'épeautre",
        "Pain traditionel a l'épautre.",
        5,
        "500g",
        30,
        "/pain-d'epeautre.avif",
      ],
      [
        julienProducerId,
        1,
        "Pain de campagne",
        "Miche de pain au levain naturel.",
        4,
        "pièce",
        15,
        "https://exemple.com/photo.jpg",
      ],
      [
        camilleProducerId,
        6,
        "Comté affiné 18 mois",
        "Fromage au lait cru affiné en cave.",
        22,
        "kg",
        12,
        "https://exemple.com/photo.jpg",
      ],
      [
        camilleProducerId,
        6,
        "Chèvre frais",
        "Bûchette de fromage de chèvre fermier.",
        5.5,
        "pièce",
        25,
        "https://exemple.com/photo.jpg",
      ],
      [
        camilleProducerId,
        6,
        "Faisselle nature",
        "Pot de faisselle fraîche à la cuillère.",
        2.8,
        "pièce",
        30,
        "https://exemple.com/photo.jpg",
      ],
      [
        nicolasProducerId,
        7,
        "Miel de fleurs",
        "Pot de miel toutes fleurs de Bourgogne.",
        7,
        "pot",
        40,
        "https://exemple.com/photo.jpg",
      ],
      [
        nicolasProducerId,
        7,
        "Miel d'acacia",
        "Miel doux et clair, récolte locale.",
        8,
        "pot",
        28,
        "https://exemple.com/photo.jpg",
      ],
      [
        nicolasProducerId,
        7,
        "Pain d'épices au miel",
        "Pain d'épices artisanal au miel local.",
        6,
        "pièce",
        18,
        "https://exemple.com/photo.jpg",
      ],
    ];

    for (const product of products) {
      await pool.query(
        `INSERT INTO products (producer_id, category_id, product_name, description, price, unit, stock, product_photo)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        product,
      );
    }

    await pool.query(
      `INSERT INTO events (title, location, event_date, description)
       VALUES 
       ($1, $2, $3, $4),
       ($5, $6, $7, $8),
       ($9, $10, $11, $12),
       ($13, $14, $15, $16)`,
      [
        "Arrivée de TUNG TUNG TUNG SAHUR",
        "67 rue du soixante-sept, Woippy",
        "2067-10-15",
        "Tung Tung Tung Sahur redescendra du paradis.",

        "Marché de producteurs",
        "Place Saint-Vincent, Chalon-sur-Saône",
        "2026-09-12",
        "Marché mensuel regroupant les producteurs locaux du réseau SaôneLocal.",

        "Dégustation fromages et vins",
        "Fromagerie Camille, Givry",
        "2026-10-03",
        "Soirée dégustation associant les fromages de Camille et les vins de la région.",

        "Récolte du miel - portes ouvertes",
        "Le Rucher de Bourgogne, Mercurey",
        "2026-08-22",
        "Visite du rucher et démonstration de récolte du miel par Nicolas.",
      ],
    );

    console.log("Seeder exécuté avec succès !");
  } catch (error) {
    console.error("Erreur lors du seeding :", error);
  } finally {
    pool.end();
  }
};

seed();
