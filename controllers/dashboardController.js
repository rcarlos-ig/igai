// School controller
const {
  getSchools,
  getActiveSchools,
} = require("../controllers/schoolController");

// Historic Data Controller
const HistoricData = require("../models/historicData");

//GET request for Dashboard Page
const dashboardView = async (req, res) => {
  const schools = await getSchools();
  const activeSchools = await getActiveSchools();

  let chartLabels = [
    "Não Avaliado",
    "Ótimo",
    "Bom",
    "Regular",
    "Ruim",
    "Péssimo",
  ];

  let chartData = [0, 0, 0, 0, 0, 0];

  for (const school of activeSchools) {
    const data = await HistoricData.find({ schoolCodigo: school.codigo })
      .sort({ atualizadoEm: -1 })
      .then((result) => {
        return result;
      });

    switch (data[0].avaliacao) {
      case chartLabels[1]:
        chartData[1] += 1;
        break;
      case chartLabels[2]:
        chartData[2] += 1;
        break;
      case chartLabels[3]:
        chartData[3] += 1;
        break;
      case chartLabels[4]:
        chartData[4] += 1;
        break;
      case chartLabels[5]:
        chartData[5] += 1;
        break;
      default:
        chartData[0] += 1;
        break;
    }
  }

  res.render("dashboard", {
    user: req.user,
    schools,
    activeSchools,
    chartLabels,
    chartData,
  });
};

module.exports = {
  dashboardView,
};
