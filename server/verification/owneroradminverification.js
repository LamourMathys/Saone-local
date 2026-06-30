exports.verifyOwnerOrAdmin = (req, res, next) => {
  const { id } = req.params;
  const currentUser = req.user;

  const isOwner = String(currentUser?.userId) === String(id);
  const isAdmin = currentUser?.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, error: "Accès interdit" });
  }

  next();
};
