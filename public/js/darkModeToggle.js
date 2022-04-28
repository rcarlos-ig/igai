// Dark mode toggle
if (typeof html === undefined) {
  const html = document.getElementById("html");
}

const darkModeToggleButton = document.querySelector("#darkModeToggle");
const darkIcon = document.getElementById("dark");
const lightIcon = document.getElementById("light");
const dashThemeText = document.getElementById("dashThemeText");

if (darkModeToggleButton !== null) {
  darkModeToggleButton.addEventListener("click", function () {
    if (html.classList.contains("dark")) {
      setUserTheme("light");
      html.classList.remove("dark");
      fadeToggle(darkIcon, lightIcon);
      dashThemeText.textContent = "Claro"
      if (typeof Chart !== undefined) {
        Chart.defaults.color = "rgb(16, 21, 25)";
        Chart.instances["0"].update();
      }
    } else {
      setUserTheme("dark");
      html.classList.add("dark");
      fadeToggle(lightIcon, darkIcon);
      dashThemeText.textContent = "Escuro"
      if (typeof Chart !== undefined) {
        Chart.defaults.color = "rgb(249, 250, 251)";
        Chart.instances["0"].update();
      }
    }
  });
}

function setUserTheme(theme) {
  fetch("/user-theme", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID: userID, theme: theme }),
  });
}

function fadeToggle(elementIn, elementOut) {
  let opacityOut = 1; //initial opacity;
  let timerOut = setInterval(() => {
    if (opacityOut <= 0.1) {
      clearInterval(timerOut);
      elementOut.style.display = "none";
      let opacityIn = 0.1; //initial opacity;
      elementIn.style.opacity = opacityIn;
      elementIn.style.display = "inline";
      let timerIn = setInterval(() => {
        if (opacityIn >= 1) {
          clearInterval(timerIn);
        }
        elementIn.style.opacity = opacityIn;
        elementIn.style.filter = "alpha(opacity = " + opacityIn * 100 + ")";
        opacityIn += 0.1;
      }, 30);
    }
    elementOut.style.opacity = opacityOut;
    elementOut.style.filter = "alpha(opacity = " + opacityOut * 100 + ")";
    opacityOut -= 0.1;
  }, 30);
}
