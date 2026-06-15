exports.verifyProducer = (req, res, next) => {
  const userRole = req.user && req.user.role;

  if (userRole === "producer" || userRole === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      error:
        "Accès refusé. Vous devez être producteur ou administrateur pour effectuer cette action.",
    });
  }
};
