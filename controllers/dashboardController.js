// School controller
const { getSchools } = require("../controllers/schoolController");

//GET request for Dashboard Page
const dashboardView = async (req, res) => {
  const schools = await getSchools();

  res.render("dashboard", {
    user: req.user,
    schools: schools,
  });
};

module.exports = {
  dashboardView,
};
