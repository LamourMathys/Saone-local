const pool = require("../db");

exports.getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createUser = async (req, res) => {
  const { first_name, last_name, email, password, role, provider, provider_id, user_photo } =
    req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, role, provider, provider_id, user_photo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, email, password, role, provider, provider_id, user_photo],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password, role, provider, provider_id, user_photo, last_login } =
    req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, role = $5, provider = $6, provider_id = $7, user_photo = $8, last_login = $9 WHERE id = $10 RETURNING *",
      [first_name, last_name, email, password, role, provider, provider_id, user_photo, last_login, id],
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
