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

exports.getMyFavorites = async (req, res) => {
  const userId = req.user.userId;
  try {
    const query = `
      SELECT 
        favorites.id AS favorite_id,
        favorites.product_id,
        favorites.producer_id,
        products.product_name,
        products.product_photo,
        products.stock,
        product_producers.business_name AS product_producer_business_name,
        product_producer_users.first_name AS product_producer_first_name,
        product_producer_users.last_name AS product_producer_last_name,
        favorite_producers.business_name AS favorite_producer_business_name,
        favorite_producer_users.first_name AS favorite_producer_first_name,
        favorite_producer_users.last_name AS favorite_producer_last_name,
        favorite_producer_users.user_photo AS favorite_producer_photo
      FROM favorites
      LEFT JOIN products ON favorites.product_id = products.id
      LEFT JOIN producers AS product_producers ON products.producer_id = product_producers.id
      LEFT JOIN users AS product_producer_users ON product_producers.user_id = product_producer_users.id
      LEFT JOIN producers AS favorite_producers ON favorites.producer_id = favorite_producers.id
      LEFT JOIN users AS favorite_producer_users ON favorite_producers.user_id = favorite_producer_users.id
      WHERE favorites.user_id = $1
    `;
    const { rows } = await pool.query(query, [userId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue lors de la récupération des favoris." });
  }
};

exports.getFavoriteById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM favorites WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Favoris non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createFavorite = async (req, res) => {
  const userId = req.user.userId;
  const { product_id, producer_id } = req.body;

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
  const { user_id, product_id, producer_id } = req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE favorites SET user_id = $1, product_id = $2, producer_id = $3 WHERE id = $4 RETURNING *",
      [user_id, product_id, producer_id, id],
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteFavorite = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  try {
    const { rows } = await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND (id = $2 OR product_id = $2 OR producer_id = $2) RETURNING *",
      [userId, id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Favoris non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
