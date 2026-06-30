const pool = require("../db");

const updateOrderTotal = async (order_id) => {
  await pool.query(
    `UPDATE orders 
     SET total_price = COALESCE((
       SELECT SUM(order_items.quantity * products.price) 
       FROM order_items 
       JOIN products ON order_items.product_id = products.id 
       WHERE order_items.order_id = $1
     ), 0)
     WHERE id = $1`,
    [order_id],
  );
};

exports.getAllOrderItems = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM order_items");
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getOrderItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM order_items WHERE id = $1",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Item de la commande non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createOrderItem = async (req, res) => {
  const { order_id, product_id, quantity } = req.body;
  const { userId, role } = req.user;

  try {
    const orderCheck = await pool.query(
      "SELECT status, user_id FROM orders WHERE id = $1",
      [order_id],
    );
    if (orderCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Commande non trouvée" });
    }

    if (
      String(orderCheck.rows[0].user_id) !== String(userId) &&
      role !== "admin"
    ) {
      return res.status(403).json({ success: false, error: "Accès interdit" });
    }

    if (orderCheck.rows[0].status !== "nouvelle") {
      return res
        .status(403)
        .json({ success: false, error: "Modification interdite à ce stade" });
    }

    const { rows } = await pool.query(
      "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
      [order_id, product_id, quantity],
    );
    await updateOrderTotal(order_id);
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateOrderItem = async (req, res) => {
  const { id } = req.params;
  const { order_id, product_id, quantity } = req.body;
  const { userId, role } = req.user;

  try {
    const itemCheck = await pool.query(
      "SELECT order_id FROM order_items WHERE id = $1",
      [id],
    );
    if (itemCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Item de la commande non trouvé" });
    }
    const currentOrderId = itemCheck.rows[0].order_id;

    const orderCheck = await pool.query(
      "SELECT status, user_id FROM orders WHERE id = $1",
      [currentOrderId],
    );
    if (
      String(orderCheck.rows[0].user_id) !== String(userId) &&
      role !== "admin"
    ) {
      return res.status(403).json({ success: false, error: "Accès interdit" });
    }

    if (orderCheck.rows[0].status !== "nouvelle") {
      return res
        .status(403)
        .json({ success: false, error: "Modification interdite à ce stade" });
    }

    const { rows } = await pool.query(
      "UPDATE order_items SET order_id = $1, product_id = $2, quantity = $3 WHERE id = $4 RETURNING *",
      [order_id, product_id, quantity, id],
    );
    await updateOrderTotal(currentOrderId);
    if (order_id !== currentOrderId) {
      await updateOrderTotal(order_id);
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteOrderItem = async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;

  try {
    const itemQuery = await pool.query(
      "SELECT order_id FROM order_items WHERE id = $1",
      [id],
    );
    if (itemQuery.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Item de la commande non trouvé" });
    }
    const order_id = itemQuery.rows[0].order_id;

    const orderCheck = await pool.query(
      "SELECT status, user_id FROM orders WHERE id = $1",
      [order_id],
    );
    if (
      String(orderCheck.rows[0].user_id) !== String(userId) &&
      role !== "admin"
    ) {
      return res.status(403).json({ success: false, error: "Accès interdit" });
    }

    if (orderCheck.rows[0].status !== "nouvelle") {
      return res
        .status(403)
        .json({ success: false, error: "Modification interdite à ce stade" });
    }

    const { rows } = await pool.query(
      "DELETE FROM order_items WHERE id = $1 RETURNING *",
      [id],
    );
    await updateOrderTotal(order_id);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
