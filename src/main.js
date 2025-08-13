import fetchCountryData from "./api.js";
import formatCompactNumber from "./convertToKMB.js";

const countryInput = document.querySelector("#countryInput");
const searchBtn = document.querySelector("#searchBtn");
const mapDiv = document.querySelector("#map");
const result = document.querySelector("#result");

searchBtn.addEventListener("click", async () => {
  try {
    const CountryName = countryInput.value.trim();
    const Country = await fetchCountryData(CountryName);

    result.innerHTML = `
    <div class="cardRow">
      <img src="${Country.flags?.png || Country.flags?.svg}">
      </div>

      <div class="info">
        <h1>Country Name: <em>${Country.name.common}</em></h1>
        <h4>Capital: ${Country.capital}</h4>
        <h4>Population: ${formatCompactNumber(Country.population)}</h4>

      </div>
  `;

    const borderCodes = Country.borders || [];
    if (borderCodes.length === 0) {
      mapDiv.innerHTML = `<p>This country has no land borders.</p>`;
    }

    const borderPromises = borderCodes.map((code) => {
      return fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    });
    const borderResponses = await Promise.all(borderPromises);
    const jsonPormises = borderResponses.map((res) => res.json());
    const borderCountrise = await Promise.all(jsonPormises);
    const neigborNames = borderCountrise.map((Country) => {
      return Country[0].name.common;
    });
    mapDiv.innerHTML = `
    <h1>${neigborNames.join(" | ")}</h1>

    `;
  } catch (e) {
    result.textContent = e.message;
  }
});
