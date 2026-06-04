const pool = require("../db");

exports.getAllEvents = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM events");
    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM events WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Événement non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, event_date, location } = req.body;
    const { rows } = await pool.query(
      "INSERT INTO events (title, description, event_date, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, event_date, location],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, event_date, location } = req.body;
  try {
    const { rows } = await pool.query(
      "UPDATE events SET title = $1, description = $2, event_date = $3, location = $4 WHERE id = $5 RETURNING *",
      [title, description, event_date, location, id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Événement non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM events WHERE id = $1 RETURNING *",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Événement non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};
