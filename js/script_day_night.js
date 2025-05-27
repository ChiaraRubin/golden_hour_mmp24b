let url = "";
let now = new Date();
now.setUTCHours(2, 0, 0, 0);

let lat = 46.9481;
let lon = 7.4;
let urlSonnenstand = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&tzid=Europe/Berlin`;
console.log("urlSonnenstand");
console.log(urlSonnenstand);

let daytimes = await loadSonne(urlSonnenstand);
// console.log("daytimes");
// console.log(daytimes);
console.log("daytimes.results.sunset");
console.log(daytimes.results.sunset); // 9:13:19 PM

let sunrise = formatDate(daytimes.results.sunrise);
let sunset = formatDate(daytimes.results.sunset);

let nextSunrise = new Date(sunrise);
if (now > sunset) {
  nextSunrise.setDate(nextSunrise.getDate() + 1);
}

// let SonnenUntergangTest = new Date();
// SonnenUntergangTest.setHours(23, 0, 0, 0);
if (now >= sunset || now <= nextSunrise) {
  console.log("Es ist dunkel");
  document.querySelector("body").style.backgroundColor = "#2b2b2b";
} else {
  console.log(now);
  console.log(sunset);
  console.log(nextSunrise);
  console.log("Es ist hell");
  document.querySelector("body").style.backgroundColor = "#edc9ad";
}

async function loadSonne(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
}

function formatDate(apiTimeString) {
  // Hole heutiges Datum im Format YYYY-MM-DD
  const heute = new Date().toISOString().split("T")[0]; // z. B. "2025-05-26"

  // Kombiniere Datum mit Zeit-String
  const dateTimeString = `${heute} ${apiTimeString}`;

  // Erzeuge und gib ein Date-Objekt zurück
  return new Date(dateTimeString);
}
