exports.verifyProducer = (req, res, next) => {
  const userRole = req.headers["user-role"];

  if (userRole === "producteur") {
    next();
  } else {
    res.status(403).json({
      success: false,
      error:
        "Accès refusé. Vous devez être producteur pour ajouter/modifier/supprimer un produit.",
    });
  }
};
