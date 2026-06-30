exports.verifyAdmin = (req, res, next) => {
  const userRole = req.headers["user-role"];

  if (userRole === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      error:
        "Accès refusé. Vous devez être administrateur pour effectuer cette action.",
    });
  }
};
