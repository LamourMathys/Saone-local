const pool = require("../db");

exports.verifyOrderOwnerOrAdmin = async (req, res, next) => {
  const { id: orderId } = req.params;
  const { userId, role } = req.user;

  try {
    const { rows } = await pool.query(
      "SELECT user_id FROM orders WHERE id = $1",
      [orderId],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Commande non trouvée" });
    }

    const isOwner = String(rows[0].user_id) === String(userId);
    const isAdmin = role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({
          success: false,
          error: "Accès interdit : vous n'êtes pas propriétaire",
        });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};
