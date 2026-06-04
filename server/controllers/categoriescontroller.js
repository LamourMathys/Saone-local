const pool = require("../db");

exports.getAllCategories = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM categories");
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Catégorie non trouvée" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
      [name, id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Catégorie non trouvée" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Catégorie non trouvée" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
