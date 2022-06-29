// School controller
const { getActiveSchools } = require("../controllers/schoolController");

// School model
const School = require("../models/schools");

// Charts Labels
const labels = [
  "Não se aplica",
  "Nota 1",
  "Nota 2",
  "Nota 3",
  "Nota 4",
  "Nota 5",
];

//GET request for Dashboard Page
const chartsDefaultView = async (req, res) => {
  const activeSchools = await getActiveSchools();
  const fields = Object.entries(School.schema.tree);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Elétricas",
        data: [0, 0, 0, 0, 0, 0],
      },
      {
        label: "Hidráulicas",
        data: [0, 0, 0, 0, 0, 0],
      },
      {
        label: "Sanitárias",
        data: [0, 0, 0, 0, 0, 0],
      },
    ],
  };

  activeSchools.forEach((school) => {
    switch (school.instalacoes.eletricas) {
      case 1:
        data.datasets[0].data[1] += 1;
        break;

      case 2:
        data.datasets[0].data[2] += 1;
        break;

      case 3:
        data.datasets[0].data[3] += 1;
        break;

      case 4:
        data.datasets[0].data[4] += 1;
        break;

      case 5:
        data.datasets[0].data[5] += 1;
        break;

      default:
        data.datasets[0].data[0] += 1;
        break;
    }

    switch (school.instalacoes.hidraulicas) {
      case 1:
        data.datasets[1].data[1] += 1;
        break;

      case 2:
        data.datasets[1].data[2] += 1;
        break;

      case 3:
        data.datasets[1].data[3] += 1;
        break;

      case 4:
        data.datasets[1].data[4] += 1;
        break;

      case 5:
        data.datasets[1].data[5] += 1;
        break;

      default:
        data.datasets[1].data[0] += 1;
        break;
    }

    switch (school.instalacoes.sanitarias) {
      case 1:
        data.datasets[2].data[1] += 1;
        break;

      case 2:
        data.datasets[2].data[2] += 1;
        break;

      case 3:
        data.datasets[2].data[3] += 1;
        break;

      case 4:
        data.datasets[2].data[4] += 1;
        break;

      case 5:
        data.datasets[2].data[5] += 1;
        break;

      default:
        data.datasets[2].data[0] += 1;
        break;
    }
  });

  res.render("charts", { data, user: req.user, fields, activeSchools });
};

module.exports = {
  chartsDefaultView,
};
