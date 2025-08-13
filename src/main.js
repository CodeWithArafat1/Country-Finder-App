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
    console.log(Country);
    result.innerHTML = `
        <div class="cardRow">
            <img src="${Country.flags?.png || Country.flags?.svg}" alt="Flag of ${Country.name.common}">
        </div>
        <div class="info">
            <h1>দেশের নাম: <em><a  style="color: white; text-decoration : none;" href="${Country.maps.googleMaps}" target="_blank" title="View on Google Maps">${Country.name.common}</a></em></h1>
            <h4>রাজধানী: ${Country.capital?.[0] || 'N/A'}</h4>
            <h4>মহাদেশ: ${Country.region}</h4>
            <h4>ভাষা: ${Object.values(Country.languages || {}).join(', ')}</h4>
            <h4>জনসংখ্যা: ${formatCompactNumber(Country.population)}</h4>
            <h4>টাইমজোন: ${Country.timezones.join(', ')}</h4>
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
