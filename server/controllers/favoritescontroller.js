const pool = require("../db");

exports.getAllFavorites = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM favorites");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getFavoriteById = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  try {
    const { rows } = await pool.query("SELECT * FROM favorites WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Favoris non trouvé" });
    }
    if (String(rows[0].user_id) !== String(userId) && role !== "admin") {
      return res.status(403).json({ success: false, error: "Accès interdit" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createFavorite = async (req, res) => {
  const { userId } = req.user;
  const { product_id, producer_id } = req.body;

  if ((product_id && producer_id) || (!product_id && !producer_id)) {
    return res.status(400).json({
      success: false,
      error:
        "Vous devez fournir soit product_id soit producer_id, pas les deux.",
    });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO favorites (user_id, product_id, producer_id) VALUES ($1, $2, $3) RETURNING *",
      [userId, product_id || null, producer_id || null],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateFavorite = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const { product_id, producer_id } = req.body;

  try {
    const check = await pool.query("SELECT * FROM favorites WHERE id = $1", [
      id,
    ]);
    if (check.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Favoris non trouvé" });
    }
    if (String(check.rows[0].user_id) !== String(userId) && role !== "admin") {
      return res.status(403).json({ success: false, error: "Accès interdit" });
    }

    const { rows } = await pool.query(
      "UPDATE favorites SET product_id = $1, producer_id = $2 WHERE id = $3 RETURNING *",
      [product_id || null, producer_id || null, id],
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteFavorite = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  try {
    const check = await pool.query("SELECT * FROM favorites WHERE id = $1", [
      id,
    ]);
    if (check.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Favoris non trouvé" });
    }
    if (String(check.rows[0].user_id) !== String(userId) && role !== "admin") {
      return res.status(403).json({ success: false, error: "Accès interdit" });
    }

    await pool.query("DELETE FROM favorites WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
