const pool = require("../db");

exports.getAllEventParticipants = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM event_participants");
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getAllEventParticipantsByEventId = async (req, res) => {
  const { eventId } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM event_participants WHERE event_id = $1",
      [eventId],
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.getEventParticipantById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM event_participants WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Participant d'événement non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.createEventParticipant= async (req, res) => { 
  const { user_id, event_id, role } =
    req.body;

  try {
    const { rows } = await pool.query(
      "INSERT INTO event_participants (user_id, event_id, role) VALUES ($1, $2, $3) RETURNING *",
      [user_id, event_id, role],
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.updateEventParticipant = async (req, res) => {
  const { id } = req.params;
  const { user_id, event_id, role } = req.body;

  try {
    const { rows } = await pool.query(
      "UPDATE event_participants SET user_id = $1, event_id = $2, role = $3 WHERE id = $4 RETURNING *",
      [user_id, event_id, role, id],
    );
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};

exports.deleteEventParticipant = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await pool.query(
      "DELETE FROM event_participants WHERE id = $1 RETURNING *",
      [id],
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Participant d'événement non trouvé" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Une erreur est survenue" });
  }
};