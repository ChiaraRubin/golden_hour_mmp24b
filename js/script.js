//Suchbegriff, der in das Suchfeld gegeben wird, wird in einer Variabel gespeichert
let suchbegriff = "";
let urlOrtschaft = "";
let sonnenAufgang = "";
let sonnenUntergang = "";
let aktuelleTageszeit = "";
let urlSonnenstand = "";
let backgroundColor = document.querySelector("body");

// Uhrzeit Hintergrundfarbenwechsel
// Wenn aktuelle Zeit, let jetzt = new Date() kleiner ist als sonnenUntergang, gib mir die Hintergrundfarbe #edc9ad aus. Andernfalls gib die Hintergrundfarbe #2b2b2b aus.

async function sonnenZeiten(lat, lon) {
  urlSonnenstand = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&tzid=Europe/Berlin`;
  let sonnenstand = await loadSonne(urlSonnenstand);
  let sonnenInformationen = sonnenstand.results;
  return sonnenInformationen;
}

let lat, lon;

function convertToDMS(decimal, isLat) {
  const dir = decimal >= 0 ? (isLat ? "N" : "E") : isLat ? "S" : "W";
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = ((minutesFloat - minutes) * 60).toFixed(2);

  return `${degrees}° ${minutes}‘ ${seconds}″ ${dir}`;
}

async function speichern() {
  suchbegriff = document.querySelector("#suchFeld").value;
  sonnenAufgang = document.querySelector("#sonnenaufgangZeit");
  sonnenUntergang = document.querySelector("#sonnenuntergangsZeit");
  urlOrtschaft = `https://nominatim.openstreetmap.org/search?city=${suchbegriff}&format=json`;
  console.log(urlOrtschaft);
  let ortschaft = await loadOrtschaft(urlOrtschaft);

  if (ortschaft && ortschaft.length > 0) {
    let lat = ortschaft[0].lat;
    let lon = ortschaft[0].lon;

    console.log("Latitude:", lat);
    console.log("Longitude:", lon);

    let latDMS = convertToDMS(lat, true);
    let lonDMS = convertToDMS(lon, false);

    document.querySelector("#stadtName").textContent = suchbegriff;
    document.querySelector("#stadtLatitude").textContent = latDMS;
    document.querySelector("#stadtLongitude").textContent = lonDMS;

    let sonnenZeitenObjekt = await sonnenZeiten(lat, lon);
    console.log(sonnenZeitenObjekt);

    document.querySelector("#sonnenaufgangZeit").textContent =
      sonnenZeitenObjekt.sunrise;
    document.querySelector("#sonnenuntergangsZeit").textContent =
      sonnenZeitenObjekt.sunset;
    document.querySelector("#aktuelleZeit").textContent =
      sonnenZeitenObjekt.day_length;
  } else {
    console.log("Keine Daten gefunden.");
  }
}

const buttonSuche = document.querySelector("#suchButton");
buttonSuche.addEventListener("click", function ladeDatenOrt() {
  speichern();
});

async function loadOrtschaft(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(error);
    return false;
  }
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
