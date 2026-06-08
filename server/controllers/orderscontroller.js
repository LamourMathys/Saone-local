const pool = require("../db");

exports.getAllOrders = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM orders");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getOrderrById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Commande non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createOrder = async (req, res) => {
  const { user_id, producer_id } =
    req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO orders (user_id, producer_id,total_price) VALUES ($1, $2, $3) RETURNING *",
      [user_id, producer_id, 0],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateOrder = async (req, res) => { //date_of_completion tba
  const { id } = req.params;
  const { user_id, producer_id, status, total_price } =
    req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE orders SET user_id = $1, producer_id = $2, status = $3, total_price = $4 WHERE id = $5 RETURNING *",
      [user_id, producer_id, status, id],
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteOrder = async (req, res) => { 
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM orders WHERE id = $1 RETURNING *",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Commande non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
