"use strict";

const cardContainer = document.querySelector(".card-container");

let allCountiesData;

fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((data) => {
    renderCountries(data);
    allCountiesData = data;
  })
  .catch((error) => {
    console.log(error);
  });

// code for dark/light mode switcher

// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem("darkMode");

const darkModeToggle = document.querySelector(".dark-mode-toggle");
const moonIcon = document.querySelector(".ri-moon-fill");
const darkModeText = document.querySelector(".text-dark");

const enableDarkMode = () => {
  // add the class to the body
  document.body.classList.add("darkmode");
  // change moon icon to sun icon
  moonIcon.classList.add("ri-sun-fill");
  // change text to light mode
  darkModeText.innerText = "Light Mode";

  localStorage.setItem("darkMode", "enabled");
};

const disableDarkMode = () => {
  // remove the class from the body
  document.body.classList.remove("darkmode");
  // change sun icon to moon icon
  moonIcon.classList.remove("ri-sun-fill");
  // change text to light mode
  darkModeText.innerText = "Dark Mode";

  localStorage.setItem("darkMode", null);
};

// if the user already visited and enabled darkMode
// start things off with it on
if (darkMode === "enabled") {
  enableDarkMode();
}

// when someone clicks the darkMode button
darkModeToggle.addEventListener("click", () => {
  // get their darkMode setting
  darkMode = localStorage.getItem("darkMode");

  // if it is not enabled, enable it
  if (darkMode !== "enabled") {
    enableDarkMode();
    // if it is enabled, turn it off
  } else {
    disableDarkMode();
  }
});

const selectButton = document.querySelector("select");

selectButton.addEventListener("change", (e) => {
  const region = e.target.value;
  if (region != "All") {
    fetch(`https://restcountries.com/v3.1/region/${region}`)
      .then((response) => response.json())
      .then(renderCountries)
      .catch((error) => {
        console.log(error);
      });
  } else {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then(renderCountries)
      .catch((error) => {
        console.log(error);
      });
  }
});

// function to render all countries
function renderCountries(data) {
  cardContainer.innerHTML = "";
  data.forEach((country) => {
    const card = document.createElement("a");
    card.classList.add("card");
    card.href = `./country/country.html?name=${country.name.common}`;

    card.innerHTML = `
            <img src="${country.flags.svg}" alt="${country.name.common}" />
            <div class="card-text">
                <h3>${country.name.common}</h3>
                <p><b>Population:</b> ${country.population.toLocaleString(
                  "en-IN"
                )}</p>
                <p><b>Region:</b> ${country.region}</p>
                <p><b>Capital:</b> ${country.capital}</p>
            </div>
        `;
    cardContainer.append(card);
  });
}

const searchBox = document.querySelector(".search-box input");

searchBox.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  if (!searchTerm) {
    return;
  }
  const filteredCountries = allCountiesData.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm)
  );
  renderCountries(filteredCountries);
});
