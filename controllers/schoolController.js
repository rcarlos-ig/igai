// MongoDB Schemas
const School = require("../models/Schools");
const User = require("../models/User");

// Calculate the "IGE"
function calculateIGE(data) {
  let indicador = new Number();

  for (let key in data) {
    data[key] = new Number(data[key]);

    if (key !== "codigo") {
      if (data[key] == 1) indicador += 15;
      if (data[key] == 2) indicador += 14;
      if (data[key] == 3) indicador += 12;
      if (data[key] == 4) indicador += 4;
      if (data[key] == 5) indicador += 0;
    }
  }

  for (let key in data) {
    if (key !== "codigo") {
    }
  }

  indicador /= 27;

  return indicador;
}

// Calculate "avaliação"
function calculateAvaliacao(indicador) {
  let avaliacao = "Não Avaliado";

  if (indicador > 0) {
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
  const schools = await School.find()
    .sort({ codigo: 1 })
    .then((result) => {
      return result;
    });

  return schools;
};

// Get active Schools
const getActiveSchools = async () => {
  const schools = await School.find({ ativa: true })
    .sort({ codigo: 1 })
    .then((result) => {
      return result;
    });

  return schools;
};

// Get sorted active Schools
async function sortSchools(sort) {
  const schools = await School.find({ ativa: true })
    .sort(sort)
    .then((result) => {
      return result;
    });

  return schools;
}

// GET Request for Register School page
const registerSchoolView = (req, res) => {
  res.render("registerSchool", {
    ativa: true,
  });
};

// POST Request that handles School register
const registerSchool = (req, res) => {
  const { codigo, nome, bairro, ocupacao, reservatorio } = req.body;
  let ativa = req.body.ativa === "on" ? true : false;

  // Check school
  School.findOne({ codigo: codigo }).then((school) => {
    if (school) {
      res.render("registerSchool", {
        codigo,
        nome,
        bairro,
        ocupacao,
        reservatorio,
        ativa,
        error: "Unidade já cadastrada.",
      });
    } else {
      // New school
      const atualizadoPor = req.user._id;

      const newSchool = new School({
        codigo,
        nome,
        bairro,
        ocupacao,
        reservatorio,
        ativa,
        indicador: 0,
        avaliacao: "Não avaliado",
        atualizadoPor,
      });
      newSchool
        .save() // Save the new School on the database
        .then(
          res.render("registerSchool", {
            success: "Escola cadastrada com sucesso.",
          })
        )
        .catch((err) => console.log(err));
    }
  });
};

// GET Request for the School page
const schoolView = async (req, res) => {
  const fields = Object.entries(School.schema.tree);

  // Check School
  School.findOne({ codigo: req.query.unidade }).then((school) => {
    if (school) {
      // Check user
      User.findOne({ _id: school.atualizadoPor }).then((user) => {
        let userName;

        if (user) {
          userName = user.name;
        } else {
          userName = "Usuário indisponível";
        }

        res.render("school", {
          school,
          fields: fields,
          user: userName,
        });
      });
    } else {
      res.redirect("/dashboard");
    }
  });
};

// POST Request for the School page
const schoolPost = (req, res) => {
  const fields = Object.entries(School.schema.tree);

  let data = req.body;

  data.indicador = calculateIGE(data);
  data.avaliacao = calculateAvaliacao(data.indicador);
  data.atualizadoEm = new Date();
  data.atualizadoPor = req.user._id;

  // Update School
  School.updateOne({ codigo: data.codigo }, { $set: data }).then(function () {
    // Check School
    School.findOne({ codigo: data.codigo }).then((school) => {
      if (school) {
        // Check User
        User.findOne({ _id: school.atualizadoPor }).then((user) => {
          let userName;

          if (user) {
            userName = user.name;
          } else {
            userName = "Usuário indisponível";
          }

          res.render("school", {
            school,
            fields: fields,
            user: userName,
            success: "Dados salvos com sucesso.",
          });
        });
      }
    });
  });
};

// GET request for the Edit School page
const editSchoolView = (req, res) => {
  // Check School
  School.findOne({ codigo: req.query.unidade }).then((school) => {
    if (school) {
      res.render("editSchool", {
        school,
      });
    }
  });
};

// POST Request for the School Editing page
const editSchool = async (req, res) => {
  const data = req.body;

  data.ativa = data.ativa === "on" ? true : false;
  data.atualizadoEm = new Date();
  data.atualizadoPor = req.user._id;

  // Update School
  await School.updateOne({ codigo: data.codigo }, { $set: data }).then(function () {
    console.log("Updated");
  });

  // Check School
  await School.findOne({ codigo: data.codigo }).then((school) => {
    if (school) {
      res.render("editSchool", {
        school,
        success: "Dados atualizados com sucesso.",
      });
    }
  });
};

// GET request for the Audit page
const auditSchoolView = async (req, res) => {
  const schools = await getActiveSchools();
  const fields = Object.entries(School.schema.tree);

  res.render("audit", {
    schools,
    field: "codigo",
    order: "asc",
    fields,
  });
};

// POST request for the Audit page
const auditSchool = async (req, res) => {
  const field = req.query.sort;
  const fields = Object.entries(School.schema.tree);

  let order = new Number();

  if (req.query.order === "asc") {
    order = 1;
  } else {
    if (req.query.order === "desc") {
      order = -1;
    }
  }

  const sort = { [field]: order };

  const schools = await sortSchools(sort);

  res.render("audit", {
    schools,
    field,
    order: req.query.order,
    fields,
  });
};

module.exports = {
  getSchools,
  registerSchool,
  registerSchoolView,
  schoolView,
  schoolPost,
  editSchoolView,
  editSchool,
  auditSchoolView,
  auditSchool,
};
