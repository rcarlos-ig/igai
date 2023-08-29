const colors = require("tailwindcss/colors");

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}

module.exports = {
  content: ["./*.css", "./views/**/*.ejs", "./public/**/*.{css,js}"],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      gray: colors.gray,
      red: colors.red,
      green: colors.green,
      primary: withOpacityValue("--primary"),
      darkPrimary: withOpacityValue("--dark-primary"),
      text: withOpacityValue("--text"),
      light: withOpacityValue("--light"),
      accent: withOpacityValue("--accent"),
      darkAccent: withOpacityValue("--dark-accent"),
    },
    extend: {},
  },
  plugins: [],
};
