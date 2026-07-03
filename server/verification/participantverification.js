const pool = require("../db");

exports.verifyOwnParticipationOrAdmin = async (req, res, next) => {
  const { id } = req.params;
  const { userId, role } = req.user;

  try {
    if (req.method === "POST") {
      if (role === "admin" || String(req.body.user_id) === String(userId))
        return next();
    } else {
      const { rows } = await pool.query(
        "SELECT user_id FROM event_participants WHERE id = $1",
        [id],
      );
      if (
        rows.length > 0 &&
        (role === "admin" || String(rows[0].user_id) === String(userId))
      ) {
        return next();
      }
    }
    return res.status(403).json({ success: false, error: "Accès interdit" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Erreur serveur" });
  }
};
