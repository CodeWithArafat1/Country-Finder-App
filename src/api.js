async function fetchCountryData(countryName) {
  try {
    const url = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    if (url.status !== 200) {
      throw new Error("Data Not Found!");
    }

    const data = await url.json();
    return data[0];
  } catch (e) {
    console.log(e.message);
  }
}

export default fetchCountryData;
