const pool = require("../db");

exports.getAllOrderItems = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM order_items");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getOrderItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM order_items WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Item de la commande non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createOrderItem = async (req, res) => {
    // Only the user who owns the order should be able to create order items, and only if the order wasn't already completed
  const { order_id, product_id, quantity } =
    req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [order_id, product_id, quantity],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateOrderItem = async (req, res) => { // Shouldn't be used outside of debugging
  const { id } = req.params;
  const { order_id, product_id, quantity } =
    req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE order_items SET order_id = $1, product_id = $2, quantity = $3 WHERE id = $4 RETURNING *",
      [order_id, product_id, quantity, id],
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteOrderItem = async (req, res) => {
    // Only the user who owns the order should be able to delete order items, and only if the order wasn't already completed
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM order_items WHERE id = $1 RETURNING *",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Item de la commande non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
