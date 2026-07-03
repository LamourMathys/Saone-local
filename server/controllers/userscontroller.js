const pool = require("../db");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, first_name, last_name, email, role, provider, provider_id, user_photo, description, created_at, last_login FROM users",
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = (
      await pool.query(
        "SELECT id, first_name, last_name, email, role, provider, provider_id, user_photo, description, created_at, last_login FROM users WHERE id = $1",
        [id],
      )
    ).rows;

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur non trouvé" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createUser = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    role,
    provider,
    provider_id,
    description,
  } = req.body;
  
  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const [user] = (
      await pool.query(
        "INSERT INTO users (first_name, last_name, email, password, role, provider, provider_id, user_photo, description) VALUES ($1, $2, $3, $4, $5, $6, $7, null, $8) RETURNING id, first_name, last_name, email, role, provider, provider_id, user_photo, description, created_at",
        [
          first_name,
          last_name,
          email,
          hashedPassword,
          role,
          provider,
          provider_id,
          description,
        ],
      )
    ).rows;
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  const currentUser = req.user;
  
  const isAdmin = currentUser?.role === "admin";
  const currentUserId = currentUser?.userId || currentUser?.id;

  if (!isAdmin && String(id) !== String(currentUserId)) {
    return res
      .status(403)
      .json({ success: false, error: "Accès refusé. Vous ne pouvez modifier que votre propre profil." });
  }

  if (req.file) {
    updates.user_photo = req.file.filename;
  }

  try {
    if (updates.email) {
      const emailResult = await pool.query(
        "SELECT id FROM users WHERE email = $1 AND id <> $2",
        [updates.email, id],
      );

      if (emailResult.rows.length > 0) {
        return res
          .status(409)
          .json({ success: false, error: "Cet email est déjà utilisé" });
      }
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (!isAdmin) {
      delete updates.role;
      delete updates.provider;
      delete updates.provider_id;
    }

    // Object.keys(updates) donne ['first_name', 'last_name']
    // .map() convertit chaque clé en SQL : 'first_name = $1', 'last_name = $2' (le i commence à 0, donc on fait +1 pour PostgreSQL)
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Aucune donnée à mettre à jour" });
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING id, first_name, last_name, email, role, provider, provider_id, user_photo, description, created_at, last_login`;

    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur non trouvé" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id],
    );
    const user = result.rows[0];

    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Utilisateur non trouvé" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Une erreur est survenue lors de la suppression.",
    });
  }
};