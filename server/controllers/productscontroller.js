const pool = require("../db");

exports.getAllProducts = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Produit non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createProduct = async (req, res) => {
  const currentUser = req.user;
  const currentUserId =
    currentUser?.userId || currentUser?.id || currentUser?.user_id;

  const {
    category_id,
    product_name,
    description,
    price,
    unit,
    stock,
    product_photo,
  } = req.body;

  if (price !== undefined && price <= 0) {
    return res.status(400).json({ success: false, error: "Prix invalide" });
  }

  if (stock !== undefined && stock < 0) {
    return res.status(400).json({ success: false, error: "Stock invalide" });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO products (producer_id, category_id, product_name, description, price, unit, stock, product_photo) 
       VALUES ((SELECT id FROM producers WHERE user_id = $1), $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
      [
        currentUserId,
        category_id,
        product_name,
        description,
        price,
        unit,
        stock,
        product_photo,
      ],
    );

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { product_name, description, price, unit, stock, product_photo } =
    req.body;
  const currentUser = req.user;

  try {
    const productCheck = await pool.query(
      `SELECT producers.user_id 
       FROM products 
       JOIN producers ON products.producer_id = producers.id 
       WHERE products.id = $1`,
      [id],
    );

    if (productCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Produit non trouvé" });
    }

    const productOwnerId = productCheck.rows[0].user_id;
    const isOwner =
      String(productOwnerId) ===
      String(currentUser?.userId || currentUser?.id || currentUser?.user_id);
    const isAdmin = currentUser?.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, error: "Accès interdit" });
    }

    if (price !== undefined && price <= 0) {
      return res.status(400).json({ success: false, error: "Prix invalide" });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ success: false, error: "Stock invalide" });
    }

    const { rows } = await pool.query(
      "UPDATE products SET product_name = $1, description = $2, price = $3, unit = $4, stock = $5, product_photo = $6 WHERE id = $7 RETURNING *",
      [product_name, description, price, unit, stock, product_photo, id],
    );

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const orderCheck = await pool.query(
      "SELECT 1 FROM order_items WHERE product_id = $1 LIMIT 1",
      [id],
    );

    if (orderCheck.rows.length > 0) {
      await pool.query("UPDATE products SET stock = 0 WHERE id = $1", [id]);
      return res.status(204).send();
    }

    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
