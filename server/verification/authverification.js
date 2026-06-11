const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    (authHeader && authHeader.split(" ")[1]) || req.cookies.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Accès refusé. Token manquant." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res
      .status(403)
      .json({ success: false, error: "Token invalide ou expiré." });
  }
};
