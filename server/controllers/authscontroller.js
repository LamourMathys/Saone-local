const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

exports.register = async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    if (userExists.rows.length > 0) {
      return res
        .status(409)
        .json({ success: false, error: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //salt de 10 rounds

    const { rows } = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, role",
      [first_name, last_name, email, hashedPassword, role || "client"],
    );

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès !",
      user: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Une erreur est survenue lors de l'inscription.",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "False email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "False email or password" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
    );
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, role } = req.body;
  try {
    if (email) {
      const emailCheck = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND id <> $2",
        [email, id],
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Cet email est déjà utilisé par un autre compte.",
        });
      }
    }

    const { rows } = await pool.query(
      "UPDATE users SET first_name = $1, last_name = $2, email = $3, role = $4 WHERE id = $5 RETURNING id, first_name, last_name, email, role",
      [first_name, last_name, email, role, id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur non trouvé." });
    }

    res.json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      data: rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Une erreur est survenue lors de la modification.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, email",
      [id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur non trouvé." });
    }

    res.json({
      success: true,
      message: `L'utilisateur avec l'email ${rows[0].email} a bien été supprimé.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Une erreur est survenue lors de la suppression.",
    });
  }
};
