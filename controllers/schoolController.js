// MongoDB Schemas
const School = require("../models/schools");
const User = require("../models/user");
const HistoricData = require("../models/historicData");

// Calculate the "IGAIE"
function calculateIGAIE(data) {
  let indicador = Number();

  for (let key in data) {
    data[key] = Number(data[key]);

    if (key === "codigo" || key === "indicador") continue;

    if (data[key] === 1) indicador += 15;
    if (data[key] === 2) indicador += 14;
    if (data[key] === 3) indicador += 12;
    if (data[key] === 4) indicador += 4;
    if (data[key] === 5) indicador += 0;
  }

  indicador /= 25;

  return indicador;
}

// Calculate "avaliação"
function calculateAvaliacao(indicador) {
  let avaliacao = "Não Avaliado";

  if (indicador >= 0) {
    avaliacao = "Ótimo";

    if (indicador > 3) {
      avaliacao = "Bom";
    }

    if (indicador > 6) {
      avaliacao = "Regular";
    }

    if (indicador > 9) {
      avaliacao = "Ruim";
    }

    if (indicador > 12) {
      avaliacao = "Péssimo";
    }
  }

  return avaliacao;
}

// Get all Schools
const getSchools = async () => {
  return School.find()
    .sort({ codigo: 1 })
    .then((result) => {
      return result;
    });
};

// Get active Schools
const getActiveSchools = async () => {
  return School.find({ ativa: true })
    .sort({ codigo: 1 })
    .then((result) => {
      return result;
    });
};

// Get sorted active Schools
async function sortSchools(sort) {
  return School.find({ ativa: true })
    .sort(sort)
    .then((result) => {
      return result;
    });
}

// GET Request for Register School page
const registerSchoolView = (req, res) => {
  res.render("registerSchool", {
    ativa: true,
    user: req.user,
  });
};

// POST Request that handles School register
const registerSchool = (req, res) => {
  const { codigo, nome, bairro, ocupacao } = req.body;
  let ativa = req.body.ativa === "on" ? true : false;

  // Check school
  School.findOne({ codigo: codigo })
    .then((school) => {
      if (school) {
        res.render("registerSchool", {
          codigo,
          nome,
          bairro,
          ocupacao,
          ativa,
          errors: ["Unidade já cadastrada."],
          user: req.user,
        });
      } else {
        // New school
        const criadoPor = req.user._id;

        const newSchool = new School({
          codigo,
          nome,
          bairro,
          ocupacao,
          ativa,
          criadoPor,
          indicador: null,
          avaliacao: "Não avaliado",
        });
        newSchool
          .save() // Save the new School on the database
          .then(function () {
            const newHistoricData = new HistoricData({
              schoolCodigo: codigo,
              indicador: null,
              avaliacao: "Não avaliado",
              atualizadoPor: criadoPor,
            });

            newHistoricData
              .save() // Save the first historic data
              .then(
                res.render("registerSchool", {
                  success: ["Escola cadastrada com sucesso."],
                  user: req.user,
                })
              )
              .catch((error) => console.log(error));
          })
          .catch((err) => console.error(err));
      }
    })
    .catch((error) => console.log(error));
};

// GET Request for the School page
const schoolView = async (req, res) => {
  const fields = Object.entries(School.schema.tree);

  // Check School
  School.findOne({ codigo: req.query.unidade })
    .then((school) => {
      // Check HistoricData
      HistoricData.find({ schoolCodigo: school.codigo })
        .sort({ atualizadoEm: -1 })
        .then((historicData) => {
          if (historicData.length < 2) {
            const legacyHistoricData = {
              indicador: school.indicador2,
              avaliacao: school.avaliacao2,
            };
            historicData.push(legacyHistoricData);
          }

          // Check user
          User.findOne({ _id: historicData[0].atualizadoPor })
            .then((user) => {
              let userName;
              if (user) {
                userName = user.name;
              } else {
                userName = "Usuário indisponível";
              }

              res.render("school", {
                school,
                fields,
                historicData,
                userName,
                user: req.user,
              });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
};

// POST Request for the School page
const schoolPost = (req, res) => {
  // Update School
  let data = req.body;

  School.findOne({ codigo: data.codigo })
    .then((school) => {
      const schoolCodigo = data.codigo;
      const indicador = calculateIGAIE(data);
      const avaliacao = calculateAvaliacao(indicador);
      const atualizadoPor = req.user._id;
      const atualizadoEm = new Date();

      data.nome = school.nome;
      data.indicador = indicador;
      data.avaliacao = avaliacao;

      // Update School
      School.updateOne({ codigo: data.codigo }, { $set: data }).catch((error) =>
        console.log(error)
      );

      // Update HistoricData
      const newHistoricData = new HistoricData({
        schoolCodigo,
        indicador,
        avaliacao,
        atualizadoPor,
        atualizadoEm,
      });
      newHistoricData
        .save() // Save the new HistoricData on the database
        .then(function () {
          res.redirect("igaie/dashboard");
        })
        .catch((err) => console.log(err));
    })
    .catch((error) => console.log(error));
};

// GET request for the Edit School page
const editSchoolView = (req, res) => {
  // Check School
  School.findOne({ codigo: req.query.unidade })
    .then((school) => {
      if (!school) return;
      res.render("editSchool", {
        school,
        user: req.user,
      });
    })
    .catch((error) => console.log(error));
};

// POST Request for the School Editing page
const editSchool = async (req, res) => {
  const data = req.body;

  data.ativa = data.ativa === "on" ? true : false;
  data["cisterna.possui"] = data["cisterna.possui"] === "on" ? true : false;
  data["cisterna.capacidade"] =
    data["cisterna.capacidade"] === "" ? 0 : data["cisterna.capacidade"];
  data["reservatorio.capacidade"] =
    data["reservatorio.capacidade"] === ""
      ? 0
      : data["reservatorio.capacidade"];
  data.atualizadoEm = new Date();
  data.atualizadoPor = req.user._id;

  // Update School
  await School.updateOne({ codigo: data.codigo }, { $set: data }).then(
    function () {
      console.log("Updated");
    }
  );

  // Check School
  await School.findOne({ codigo: data.codigo }).then((school) => {
    if (!school) return;
    res.render("editSchool", {
      school,
      success: ["Dados atualizados com sucesso."],
      user: req.user,
    });
  });
};

// GET request for the Audit page
const auditSchoolView = async (req, res) => {
  const schools = await getActiveSchools();
  const fields = Object.entries(School.schema.tree);
  const field = "codigo";
  const order = "asc";

  res.render("audit", {
    schools,
    field,
    order,
    fields,
    user: req.user,
  });
};

// POST request for the Audit page
const auditSchool = async (req, res) => {
  const field = req.body.auditSort;
  const order = req.body.auditOrder;
  const fields = Object.entries(School.schema.tree);

  let sortOrder = 1;

  if (order === "desc") sortOrder = -1;

  const sort = { [field]: sortOrder };

  const schools = await sortSchools(sort);

  res.render("audit", {
    schools,
    field,
    order,
    fields,
    user: req.user,
  });
};

// GET Request for Tabulator tables
const getSchoolsData = async (_req, res) => {
  const schoolsData = await getSchools();

  res.send(schoolsData);
};

module.exports = {
  getSchools,
  getActiveSchools,
  registerSchool,
  registerSchoolView,
  schoolView,
  schoolPost,
  editSchoolView,
  editSchool,
  auditSchoolView,
  auditSchool,
  getSchoolsData,
};
