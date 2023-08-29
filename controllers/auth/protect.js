// Check if user is logged in
const protectRoute = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  console.log("Please log in to continue");
  res.render("login");
};

const isSuperuser = (req, res, next) => {
  if (req.isAuthenticated()) {
    let userRole = req.user.role;

    if (userRole === "superuser") {
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
  isSuperuser,
};
