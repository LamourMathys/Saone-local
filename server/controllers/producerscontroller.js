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
  const user_id = req.user.id;
  const { business_name, shop_location, siret } = req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO producers (user_id, business_name, shop_location, siret) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, business_name, shop_location, siret],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateProducer = async (req, res) => {
  const { id } = req.params;
  const { business_name, description, shop_location, producer_photo, siret } =
    req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE producers 
       SET business_name = $1, shop_location = $2, siret = $3 
       WHERE id = $4 
       RETURNING *`,
      [business_name, shop_location, siret, id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Producteur non trouvé." });
    }

    return res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du producteur.",
    });
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
