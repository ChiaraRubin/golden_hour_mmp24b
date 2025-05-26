let url = "";
let now = new Date();
let jetzt = now.toLocaleTimeString("de-DE");
console.log("jetzt"); // z. B. "14:42:17"
console.log(jetzt); // z. B. "14:42:17"
// jetzt.setHours(20, 0, 0, 0); // 21:00:00.000

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

// let SonnenUntergangTest = new Date();
// SonnenUntergangTest.setHours(23, 0, 0, 0);
if (jetzt > sunset) {
  console.log("Es ist dunkel");
} else {
  console.log("Es ist hell");
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
