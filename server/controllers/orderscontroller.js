const pool = require("../db");

exports.getAllOrders = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM orders");
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [
      id,
    ]);
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getAllOrdersByUser = async (req, res) => {
  const { userId } = req.user;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1",
      [userId],
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getAllOrdersByProducer = async (req, res) => {
  const { userId } = req.user;
  try {
    const producerCheck = await pool.query(
      "SELECT id FROM producers WHERE user_id = $1",
      [userId],
    );
    if (producerCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ success: false, error: "Producteur non trouvé" });
    }
    const producer_id = producerCheck.rows[0].id;
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE producer_id = $1",
      [producer_id],
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getAllOrdersCompleted = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE status = 'retiree' OR status = 'terminee'",
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createOrder = async (req, res) => {
  const { producer_id } = req.body;
  const { userId, role } = req.user;

  try {
    if (role === "producer") {
      const producerCheck = await pool.query(
        "SELECT user_id FROM producers WHERE id = $1",
        [producer_id],
      );
      if (
        producerCheck.rows.length > 0 &&
        String(producerCheck.rows[0].user_id) === String(userId)
      ) {
        return res.status(400).json({
          success: false,
          error: "Interdiction d'acheter ses propres produits",
        });
      }
    }

    const { rows } = await pool.query(
      "INSERT INTO orders (user_id, producer_id, total_price, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [userId, producer_id, 0, "nouvelle"],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const { user_id, producer_id, status, total_price } = req.body;
  const { role } = req.user;

  try {
    const checkStatus = await pool.query(
      "SELECT status FROM orders WHERE id = $1",
      [id],
    );
    const currentStatus = checkStatus.rows[0].status;

    if (currentStatus !== "nouvelle" && role !== "admin") {
      return res
        .status(403)
        .json({ success: false, error: "Modification interdite à ce stade" });
    }

    if (role === "admin") {
      const { rows } = await pool.query(
        "UPDATE orders SET user_id = $1, producer_id = $2, status = $3, total_price = $4 WHERE id = $5 RETURNING *",
        [user_id, producer_id, status, total_price, id],
      );
      res.json({ success: true, data: rows[0] });
    } else {
      const { rows } = await pool.query(
        "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
        [status, id],
      );
      res.json({ success: true, data: rows[0] });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  try {
    const checkStatus = await pool.query(
      "SELECT status FROM orders WHERE id = $1",
      [id],
    );
    const currentStatus = checkStatus.rows[0].status;

    if (currentStatus !== "nouvelle" && role !== "admin") {
      return res
        .status(403)
        .json({ success: false, error: "Annulation interdite à ce stade" });
    }

    const { rows } = await pool.query(
      "DELETE FROM orders WHERE id = $1 RETURNING *",
      [id],
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
