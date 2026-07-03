const pool = require("../db");

exports.verifyProductOwnerOrAdmin = async (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.user;

  try {
    const { rows } = await pool.query(
      `SELECT producers.user_id 
    FROM products 
    JOIN producers ON products.producer_id = producers.id 
    WHERE products.id = $1`,
      [id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Produit non trouvé" });
    }

    const productOwnerId = rows[0].user_id;
    const isOwner =
      String(productOwnerId) === String(currentUser?.userId || currentUser?.id);
    const isAdmin = currentUser?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: "Accès interdit" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
