"use strict";

// getting country name from url
const countryName = new URLSearchParams(window.location.search).get("name");

const backButton = document.querySelector(".back-button");

const countryImage = document.querySelector(".country-image");
const countryNameElement = document.querySelector(".country-name");
const nativeNameElement = document.querySelector(".native-name");
const population = document.querySelector(".population");
const region = document.querySelector(".region");
const subRegion = document.querySelector(".sub-region");
const capital = document.querySelector(".capital");
const tld = document.querySelector(".tld");
const currencyElement = document.querySelector(".currency");
const currencySymbol = document.querySelector(".currency-symbol");
const languages = document.querySelector(".languages");

const borderCountries = document.querySelector(".border-countries");

fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
  .then((response) => response.json())
  .then(([country]) => {
    // check native name
    let nativeName;
    if (country.name.nativeName) {
      nativeName = Object.values(country.name.nativeName)[0].common;
    } else {
      nativeName = country.name.common;
    }

    // check currencies
    let currency;
    let symbol;
    if (country.currencies) {
      currency = Object.values(country.currencies)
        .map((currency) => currency.name)
        .join(", ");
      symbol = Object.values(country.currencies)[0].symbol;
    }

    // set country image
    countryImage.firstElementChild.src = country.flags.svg;
    countryImage.firstElementChild.alt = country.name.common;

    // country name
    countryNameElement.innerText = country.name.common;

    // country details
    nativeNameElement.innerText = nativeName;
    population.innerText = country.population.toLocaleString("en-IN");
    region.innerText = country.region;
    subRegion.innerText = country.subregion;
    capital.innerText = country.capital?.join(", ");
    tld.innerText = country.tld?.join(", ");
    currencyElement.innerText = currency;
    currencySymbol.innerText = symbol;
    languages.innerText = Object.values(country.languages)?.join(", ");

    if (country.borders) {
      country.borders.forEach((border) => {
        fetch(`https://restcountries.com/v3.1/alpha/${border}`)
          .then((response) => response.json())
          .then(([borderCountry]) => {
            const borderLink = document.createElement("a");
            borderLink.innerText = borderCountry.name.common;
            borderLink.href = `/country/country.html?name=${borderCountry.name.common}`;
            borderCountries.append(borderLink);
          });
      });
    }
  })
  .catch((error) => {
    console.log(error);
  });

backButton.addEventListener("click", () => {
  window.history.back();
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
