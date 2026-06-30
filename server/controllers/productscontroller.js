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
  try {
    const {
      producer_id,
      category_id,
      product_name,
      description,
      price,
      unit,
      stock,
      product_photo,
    } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO products (producer_id, category_id, product_name, description, price, unit, stock, product_photo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        producer_id,
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

  try {
    await pool.query(
      "UPDATE products SET product_name = $1, description = $2, price = $3, unit = $4, stock = $5, product_photo = $6 WHERE id = $7 RETURNING *",
      [product_name, description, price, unit, stock, product_photo, id],
    );
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

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id],
    );
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
