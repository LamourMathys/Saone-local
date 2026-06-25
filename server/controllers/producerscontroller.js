const pool = require("../db");

exports.getAllProducers = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        producers.*, 
        users.user_photo, 
        users.first_name AS first_name,
        users.last_name AS last_name
      FROM producers
      INNER JOIN users ON producers.user_id = users.id
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Erreur dans getAllProducers:", error);
    res.status(500).json({
      success: false,
      error: "Une erreur est survenue lors de la récupération des producteurs",
    });
  }
};

exports.getProducerById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM producers WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Producteur non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createProducer = async (req, res) => {
  const { user_id, business_name, shop_location, siret } = req.body;

  if (!user_id || !business_name || !shop_location || !siret) {
    return res.status(400).json({
      success: false,
      error:
        "Données invalides. Le nom d'exploitation, l'adresse de la ferme, le SIRET et l'ID de l'utilisateur sont obligatoires.",
    });
  }

  try {
    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [
      user_id,
    ]);
    if (userCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur spécifié non trouvé." });
    }

    const { rows } = await pool.query(
      "INSERT INTO producers (user_id, business_name, shop_location, siret) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, business_name, shop_location, siret],
    );

    await pool.query("UPDATE users SET role = 'producer' WHERE id = $1", [
      user_id,
    ]);

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateProducer = async (req, res) => {
  const { id } = req.params;
  const { business_name, shop_location, siret } = req.body;

  const currentUserId = req.user.userId;
  const currentUserRole = req.user.role;

  try {
    const producerCheck = await pool.query(
      "SELECT user_id FROM producers WHERE id = $1",
      [id],
    );

    if (producerCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Producteur non trouvé." });
    }

    const producerOwnerId = producerCheck.rows[0].user_id;

    if (currentUserRole !== "admin" && producerOwnerId !== currentUserId) {
      return res.status(403).json({
        success: false,
        error: "Accès refusé. Vous ne pouvez modifier que votre propre fiche.",
      });
    }

    const { rows } = await pool.query(
      `UPDATE producers 
       SET business_name = $1, shop_location = $2, siret = $3 
       WHERE id = $4 
       RETURNING *`,
      [business_name, shop_location, siret, id],
    );

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du producteur.",
    });
  }
};

exports.deleteProducer = async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.userId;
  const currentUserRole = req.user.role;

  try {
    const producerCheck = await pool.query(
      "SELECT user_id FROM producers WHERE id = $1",
      [id],
    );

    if (producerCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Producteur non trouvé." });
    }

    const producerOwnerId = producerCheck.rows[0].user_id;

    if (
      currentUserRole !== "admin" &&
      Number(producerOwnerId) !== Number(currentUserId)
    ) {
      return res.status(403).json({ success: false, error: "Accès refusé." });
    }

    await pool.query("UPDATE users SET role = 'user' WHERE id = $1", [
      producerOwnerId,
    ]);
    await pool.query("DELETE FROM producers WHERE id = $1", [id]);

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Erreur lors de la suppression." });
  }
};
