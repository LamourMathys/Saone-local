const pool = require("../db");

exports.getAllFavorites = async (req, res) => { // Only admins should be able to see (for stats perhaps?)
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

exports.createFavorite= async (req, res) => { 
    // a user should only be able to create a favorite for themself
    // product_id XOR producer_id (Cannot have both)
  const { user_id, product_id, producer_id } =
    req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO favorites (user_id, product_id, producer_id) VALUES ($1, $2, $3) RETURNING *",
      [user_id, product_id, producer_id],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateFavorite = async (req, res) => { // Shouldn't be used outside of debugging
  const { id } = req.params;
  const { user_id, product_id, producer_id } =
    req.body;

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
    // Only the user who owns the favorite should be able to delete it
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM favorites WHERE id = $1 RETURNING *",
      [id],
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
