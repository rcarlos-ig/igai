// MongoDB Schemas
const School = require("../models/Schools");
const User = require("../models/User");

// Calculate the "IGE"
function calculateIGE(data) {
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

  indicador /= 27;

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
        user: req.user,
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
            user: req.user,
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
          userName,
          user: req.user,
        });
      });
    } else {
      res.redirect("/dashboard");
    }
  });
};

// POST Request for the School page
const schoolPost = (req, _res, next) => {
  let data = req.body;

  School.findOne({ codigo: data.codigo }).then((school) => {
    data.indicador = calculateIGE(data);
    data.avaliacao = calculateAvaliacao(data.indicador);
    data.atualizadoEm = new Date();
    data.atualizadoPor = req.user._id;
    data.indicador2 = school.indicador;
    data.avaliacao2 = school.avaliacao;

    // Update School
    School.updateOne({ codigo: data.codigo }, { $set: data }).then(next());
  });
};

// GET request for the Edit School page
const editSchoolView = (req, res) => {
  // Check School
  School.findOne({ codigo: req.query.unidade }).then((school) => {
    if (!school) return;
    res.render("editSchool", {
      school,
      user: req.user,
    });
  });
};

// POST Request for the School Editing page
const editSchool = async (req, res) => {
  const data = req.body;

  data.ativa = data.ativa === "on" ? true : false;
  data["cisterna.possui"] = data["cisterna.possui"] === "on" ? true : false;
  data["cisterna.capacidade"] = data["cisterna.capacidade"] === "" ? 0 : data["cisterna.capacidade"];
  data["reservatorio.capacidade"] = data["reservatorio.capacidade"] === "" ? 0 : data["reservatorio.capacidade"];
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
      success: "Dados atualizados com sucesso.",
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
};
