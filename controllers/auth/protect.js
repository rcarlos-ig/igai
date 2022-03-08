// Check if user is logged in
const protectRoute = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("Please log in to continue");
  res.render("login", {error: "Usuário não logado."});
};

module.exports = {
  protectRoute,
};
