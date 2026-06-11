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
      return res
        .status(401)
        .json({ success: false, error: "Email ou mot de passe incorrect." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, error: "Email ou mot de passe incorrect." });
    }

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" },
    );

    await pool.query(
      "INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '30 days') ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at",
      [refreshToken, user.id],
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Connexion réussie" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        error: "Une erreur serveur est survenue lors de la connexion.",
      });
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

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, error: "Refresh Token manquant." });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [refreshToken],
    );
    if (rows.length === 0) {
      return res
        .status(403)
        .json({ success: false, error: "Refresh Token invalide ou révoqué." });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const userResult = await pool.query(
      "SELECT id, role FROM users WHERE id = $1",
      [decoded.userId],
    );
    const user = userResult.rows[0];

    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(403).json({
      success: false,
      error: "Session expirée, veuillez vous reconnecter.",
    });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [
      refreshToken,
    ]);
  }
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Déconnexion réussie" });
};
