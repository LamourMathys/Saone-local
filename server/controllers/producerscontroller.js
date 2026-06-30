const pool = require("../db");

exports.getAllProducers = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM producers");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getProducerById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM producers WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Producteur non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createProducer = async (req, res) => {
  const { user_id, producer_name, description, shop_location, producer_photo } =
    req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO producers (user_id, producer_name, description, shop_location, producer_photo) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, producer_name, description, shop_location, producer_photo],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateProducer = async (req, res) => {
  const { id } = req.params;
  const { producer_name, description, shop_location, producer_photo } =
    req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE producers SET producer_name = $1, description = $2, shop_location = $3, producer_photo = $4 WHERE id = $5 RETURNING *",
      [producer_name, description, shop_location, producer_photo, id],
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteProducer = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM producers WHERE id = $1 RETURNING *",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Producteur non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
