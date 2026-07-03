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

exports.getCartItems = async (req, res) => {
  const userId = req.user.userId;
  try {
    const query = `
      SELECT 
        order_items.id AS order_item_id,
        order_items.order_id,
        order_items.product_id,
        order_items.quantity,
        products.product_name,
        products.product_photo,
        products.price,
        products.unit,
        products.stock,
        producers.id AS producer_id,
        producers.business_name,
        users.first_name AS producer_first_name,
        users.last_name AS producer_last_name
      FROM orders
      JOIN order_items ON orders.id = order_items.order_id
      JOIN products ON order_items.product_id = products.id
      JOIN producers ON products.producer_id = producers.id
      JOIN users ON producers.user_id = users.id
      WHERE orders.user_id = $1 AND orders.status = 'nouvelle'
    `;
    const { rows } = await pool.query(query, [userId]);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue lors de la récupération du panier." });
  }
};

exports.addToCart = async (req, res) => {
  const userId = req.user.userId;
  const { product_id, quantity = 1 } = req.body;

  try {
    const productQuery = await pool.query("SELECT producer_id FROM products WHERE id = $1", [product_id]);
    if (productQuery.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Produit non trouvé" });
    }
    const producerId = productQuery.rows[0].producer_id;

    let orderId;
    const orderQuery = await pool.query(
      "SELECT id FROM orders WHERE user_id = $1 AND producer_id = $2 AND status = 'nouvelle'",
      [userId, producerId]
    );

    if (orderQuery.rows.length > 0) {
      orderId = orderQuery.rows[0].id;
    } else {
      const newOrder = await pool.query(
        "INSERT INTO orders (user_id, producer_id, total_price, status) VALUES ($1, $2, 0, 'nouvelle') RETURNING id",
        [userId, producerId]
      );
      orderId = newOrder.rows[0].id;
    }

    const itemQuery = await pool.query(
      "SELECT id, quantity FROM order_items WHERE order_id = $1 AND product_id = $2",
      [orderId, product_id]
    );

    if (itemQuery.rows.length > 0) {
      const newQty = itemQuery.rows[0].quantity + quantity;
      await pool.query(
        "UPDATE order_items SET quantity = $1 WHERE id = $2",
        [newQty, itemQuery.rows[0].id]
      );
    } else {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [orderId, product_id, quantity]
      );
    }

    await updateOrderTotal(orderId);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue lors de l'ajout au panier." });
  }
};

exports.updateCartItemQuantity = async (req, res) => {
  const userId = req.user.userId;
  const { product_id, quantity } = req.body;

  try {
    const itemQuery = await pool.query(
      `SELECT order_items.id, order_items.order_id 
       FROM order_items 
       JOIN orders ON order_items.order_id = orders.id 
       WHERE orders.user_id = $1 AND order_items.product_id = $2 AND orders.status = 'nouvelle'`,
      [userId, product_id]
    );

    if (itemQuery.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Produit non trouvé dans le panier." });
    }

    const itemId = itemQuery.rows[0].id;
    const orderId = itemQuery.rows[0].order_id;

    if (quantity <= 0) {
      await pool.query("DELETE FROM order_items WHERE id = $1", [itemId]);
      
      const countQuery = await pool.query("SELECT COUNT(*) FROM order_items WHERE order_id = $1", [orderId]);
      if (parseInt(countQuery.rows[0].count, 10) === 0) {
        await pool.query("DELETE FROM orders WHERE id = $1", [orderId]);
      } else {
        await updateOrderTotal(orderId);
      }
    } else {
      await pool.query("UPDATE order_items SET quantity = $1 WHERE id = $2", [quantity, itemId]);
      await updateOrderTotal(orderId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue lors de la mise à jour de la quantité." });
  }
};

exports.removeCartItem = async (req, res) => {
  const userId = req.user.userId;
  const { productId } = req.params;

  try {
    const itemQuery = await pool.query(
      `SELECT order_items.id, order_items.order_id 
       FROM order_items 
       JOIN orders ON order_items.order_id = orders.id 
       WHERE orders.user_id = $1 AND order_items.product_id = $2 AND orders.status = 'nouvelle'`,
      [userId, productId]
    );

    if (itemQuery.rows.length === 0) {
      return res.status(404).json({ success: false, error: "Produit non trouvé dans le panier." });
    }

    const itemId = itemQuery.rows[0].id;
    const orderId = itemQuery.rows[0].order_id;

    await pool.query("DELETE FROM order_items WHERE id = $1", [itemId]);
    
    const countQuery = await pool.query("SELECT COUNT(*) FROM order_items WHERE order_id = $1", [orderId]);
    if (parseInt(countQuery.rows[0].count, 10) === 0) {
      await pool.query("DELETE FROM orders WHERE id = $1", [orderId]);
    } else {
      await updateOrderTotal(orderId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue lors de la suppression." });
  }
};

exports.checkoutCart = async (req, res) => {
  const userId = req.user.userId;

  try {
    const { rows } = await pool.query(
      "UPDATE orders SET status = 'en préparation' WHERE user_id = $1 AND status = 'nouvelle' RETURNING *",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, error: "Votre panier est vide." });
    }

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue lors du passage de la commande." });
  }
};
