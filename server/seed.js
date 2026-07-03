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
      `INSERT INTO users (first_name, last_name, email, password, role, provider, description, user_photo)
    VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8),
    ($9, $10, $11, $12, $13, $14, $15, $16),
    ($17, $18, $19, $20, $21, $22, $23, $24),
    ($25, $26, $27, $28, $29, $30, $31, $32),
    ($33, $34, $35, $36, $37, $38, $39, $40),
    ($41, $42, $43, $44, $45, $46, $47, $48),
    ($49, $50, $51, $52, $53, $54, $55, $56)
    ON CONFLICT (email) DO NOTHING RETURNING id, email`,
      [
        "Admin",
        "1",
        "admin@saonelocal.fr",
        await bcrypt.hash("MDPsecuriseadmin", 10),
        "admin",
        "local",
        "Administrateur principal de la plateforme.",
        null,

        "Admin",
        "2",
        "admin2@saonelocal.fr",
        await bcrypt.hash("MDPsecuriseadmin2", 10),
        "admin",
        "local",
        "Modérateur et support technique.",
        null,

        "Isabelle",
        "Fontaine-Marchais",
        "isabelle.fm@saonelocal.fr",
        await bcrypt.hash("MDPsecuriseIsabelle", 10),
        "producer",
        "local",
        "Vigneronne au Domaine de la Côte Chalonnaise, Mercurey.",
        "/saonelocal-isabelle.jpg",

        "Théo",
        "nom",
        "theo@saonelocal.fr",
        await bcrypt.hash("MDPsecuriseThéo", 10),
        "client",
        "local",
        "Si c'est galère, je commande sur Amazon et basta.",
        null,

        "Karim",
        "Benchouia",
        "karim@saonelocal.fr",
        await bcrypt.hash("MDPsecuriseKarim", 10),
        "producer",
        "local",
        "Karim Benchouia, artisant boulanger à Saint-Marcel, labellisé Saveurs de Bourgogne.",
        "/saonelocal-karim.jpg",

        "Michel",
        "Durant",
        "michel@saonelocal.fr",
        await bcrypt.hash("MDPsecuriseMichel", 10),
        "producer",
        "local",
        "Cultive des légumes frais et de saison avec passion, dans le respect de la terre et des saveurs.",
        "/saonelocal-michel.jpg",

        "Nicolas",
        "Avis",
        "nicolas@saonelocal.fr",
        await bcrypt.hash("MDPsecurisenicolas", 10),
        "producer",
        "local",
        "Éleveur de poules plein air et apiculteur passionné.",
        "/saonelocal-nicolas.png",
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

    const isabelleId = await getUserId("isabelle.fm@saonelocal.fr");
    const michelId = await getUserId("michel@saonelocal.fr");
    const karimId = await getUserId("karim@saonelocal.fr");
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

    const isabellePId = await upsertProducer(
      isabelleId,
      "Domaine de la Côte Chalonnaise",
      "Mercurey",
      "11111111111111",
    );

    const michelPId = await upsertProducer(
      michelId,
      "La Ferme",
      "Crissey",
      "11111111111112",
    );

    const karimPId = await upsertProducer(
      karimId,
      "Saveur de Bourgogne",
      "Saint-Marcel",
      "11111111111113",
    );

    const nicolasPId = await upsertProducer(
      nicolasId,
      "Les poules et compagnies",
      "5 chemin de foussot, Ouroux",
      "11111111111114",
    );

    const products = [
      [
        karimPId,
        1,
        "Baguette tradition",
        "baguette tradition.",
        1.2,
        "unité",
        30,
        "/baguette.webp",
      ],
      [
        michelPId,
        3,
        "Carottes du potager",
        "Botte de carottes bio du jardin.",
        2.5,
        "botte",
        30,
        "/carottes.webp",
      ],
      [
        nicolasPId,
        4,
        "oeufs plein air",
        "Boite d'oeuf local.",
        3.3,
        "douzaine",
        20,
        "/oeufs.webp",
      ],
      [
        karimPId,
        1,
        "Pain au Levain",
        "Pain traditionnel au levain.",
        1.5,
        "unité",
        25,
        "/pain-au-levain.webp",
      ],
      [
        karimPId,
        1,
        "pain aux céréales",
        "Pain traditionel au Céreales.",
        2,
        "unité",
        20,
        "/pain-aux-cereales.webp",
      ],
      [
        karimPId,
        1,
        "pain d'épeautre",
        "Pain traditionel a l'épautre.",
        5,
        "500g",
        30,
        "/pain-d'epeautre.webp",
      ],
      [
        karimPId,
        1,
        "Pain de campagne",
        "Miche de pain au levain naturel.",
        4,
        "pièce",
        15,
        null,
      ],
      [
        nicolasPId,
        6,
        "Comté affiné 18 mois",
        "Fromage au lait cru affiné en cave.",
        22,
        "kg",
        12,
        null,
      ],
      [
        nicolasPId,
        6,
        "Chèvre frais",
        "Bûchette de fromage de chèvre fermier.",
        5.5,
        "pièce",
        25,
        null,
      ],
      [
        nicolasPId,
        6,
        "Faisselle nature",
        "Pot de faisselle fraîche à la cuillère.",
        2.8,
        "pièce",
        30,
        null,
      ],
      [
        nicolasPId,
        7,
        "Miel de fleurs",
        "Pot de miel toutes fleurs de Bourgogne.",
        7,
        "pot",
        40,
        null,
      ],
      [
        nicolasPId,
        7,
        "Miel d'acacia",
        "Miel doux et clair, récolte locale.",
        8,
        "pot",
        28,
        null,
      ],
      [
        isabellePId,
        2,
        "Rosée en folie",
        "Rosée en folie vin de bonne fabrique.",
        12,
        "bouteille",
        18,
        null,
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
        "Vendanges ouvertes au Domaine",
        "Domaine de la Côte Chalonnaise, Mercurey",
        "2026-10-15",
        "Venez découvrir les coulisses des vendanges avec Isabelle. Au programme : initiation à la récolte du chardonnay et dégustation du nouveau millésime.",

        "Atelier Potager & Cueillette",
        "La Ferme, Crissey",
        "2026-09-12",
        "Michel vous ouvre ses portes pour un après-midi découverte. Apprenez à récolter vos propres carottes bio et repartez avec votre botte fraîche.",

        "Secret du pain au levain avec Karim",
        "Saveur de Bourgogne, Saint-Marcel",
        "2026-10-03",
        "Un atelier unique mené par Karim pour maîtriser la fabrication artisanale de la baguette tradition et la gestion du levain naturel.",

        "Récolte de miel et soins du rucher",
        "Les poules et compagnies, Ouroux",
        "2026-08-22",
        "Nicolas vous propose une immersion au cœur de ses ruches. Démonstration d'extraction de miel toutes fleurs et rencontre avec ses poules de plein air.",
      ],
    );

    const theoId = await getUserId("theo@saonelocal.fr");
    if (theoId) {
      const baguetteResult = await pool.query("SELECT id FROM products WHERE product_name = $1", ["Baguette tradition"]);
      if (baguetteResult.rows[0]) {
        await pool.query(
          "INSERT INTO favorites (user_id, product_id, producer_id) VALUES ($1, $2, $3)",
          [theoId, baguetteResult.rows[0].id, null]
        );
      }
      
      const carottesResult = await pool.query("SELECT id FROM products WHERE product_name = $1", ["Carottes du potager"]);
      if (carottesResult.rows[0]) {
        await pool.query(
          "INSERT INTO favorites (user_id, product_id, producer_id) VALUES ($1, $2, $3)",
          [theoId, carottesResult.rows[0].id, null]
        );
      }

      if (karimPId) {
        await pool.query(
          "INSERT INTO favorites (user_id, product_id, producer_id) VALUES ($1, $2, $3)",
          [theoId, null, karimPId]
        );
      }
    }

    console.log("Seeder exécuté avec succès !");
  } catch (error) {
    console.error("Erreur lors du seeding :", error);
  } finally {
    pool.end();
  }
};

seed();