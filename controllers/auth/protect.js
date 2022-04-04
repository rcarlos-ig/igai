// Check if user is logged in
const protectRoute = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  console.log("Please log in to continue");
  res.render("login");
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    let user = String(req.user._id);

    if (user === "6217d8c12bfa7e0528d3174e") {
      return next();
    }

    console.log("Not the system admin.");
    res.render("login", { error: "Usuário não autorizado." });
  }
  console.log("Please log in to continue");
  res.render("login", { error: "Usuário não logado." });
};

module.exports = {
  protectRoute,
  isAdmin,
};
