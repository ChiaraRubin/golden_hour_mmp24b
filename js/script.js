console.log("Dokument wieder geladen");

let suchbegriff = "";
let urlOrtschaft = "";
let sonnenAufgang = "";
let sonnenUntergang = "";
let aktuelleTageszeit = "";
let urlSonnenstand = "";
let backgroundColor = document.querySelector("body");

function parseUtcTimeToLocal(apiTimeString, timeZone) {
  const heute = new Date().toISOString().split("T")[0];
  const [time, meridian] = apiTimeString.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);

  if (meridian === "PM" && hours !== 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;

  // Erzeuge ISO-Zeitstring als UTC-Zeit
  const utcIsoString = `${heute}T${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}Z`;

  const dateUtc = new Date(utcIsoString);

  return dateUtc.toLocaleTimeString("de-DE", {
    timeZone: timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// **ÄNDERUNG 2: Funktion, um API-Zeit als UTC-Date-Objekt zu bekommen (für Vergleich und Berechnung)**
function parseUtcTimeToDate(apiTimeString) {
  const heute = new Date().toISOString().split("T")[0];
  const [time, meridian] = apiTimeString.split(" ");
  let [hours, minutes, seconds] = time.split(":").map(Number);

  if (meridian === "PM" && hours !== 12) hours += 12;
  if (meridian === "AM" && hours === 12) hours = 0;

  return new Date(
    `${heute}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}Z`
  );
}

// **ÄNDERUNG 3: tagNachtHintergrund mit neuem Parsing**
async function tagNachtHintergrund(lat, lon) {
  const urlSonnenstand = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&tzid=Europe/Berlin`;
  const sonnenstand = await loadSonne(urlSonnenstand);

  let now = new Date();

  const sunrise = parseUtcTimeToDate(sonnenstand.results.sunrise);
  const sunset = parseUtcTimeToDate(sonnenstand.results.sunset);

  let nextSunrise = new Date(sunrise);
  if (now > sunset) {
    nextSunrise.setDate(nextSunrise.getDate() + 1);
  }

  if (now >= sunset || now <= nextSunrise) {
    document.querySelector("body").style.backgroundColor = "#2b2b2b";
    document.querySelector("#titelWebsite").style.color = "#ECD2C3";
    document.querySelector("#stadtName").style.color = "#ECD2C3";
    document.querySelector("#latitudeLongitude").style.color = "#ECD2C3";
    document.querySelector("#sonnenInfo").style.color = "#ECD2C3";
    console.log("Es ist dunkel");
  } else {
    document.querySelector("body").style.backgroundColor = "#edc9ad";
    document.querySelector("#titelWebsite").style.color = "#563723";
    document.querySelector("#stadtName").style.color = "#563723";
    document.querySelector("#latitudeLongitude").style.color = "#563723";
    document.querySelector("#sonnenInfo").style.color = "#563723";
    console.log("Es ist hell");
    console.log(now);
    console.log(sunset);
    console.log(nextSunrise);
  }
}

//------------------------------------------------------------------------
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

// Sonnenpositionierung
function positioniereSonne(sunrise, sunset) {
  const sunImg = document.querySelector("#sun");
  const now = new Date();

  const sunriseTime = new Date(sunrise);
  const sunsetTime = new Date(sunset);

  if (now < sunriseTime || now > sunsetTime) {
    sunImg.style.display = "none";
    return;
  }

  const totalDuration = sunsetTime - sunriseTime;
  const currentDuration = now - sunriseTime;
  const t = currentDuration / totalDuration;

  const angle = Math.PI * t;

  const radiusVW = 75;
  const x = radiusVW * Math.cos(angle - Math.PI);
  const y = radiusVW * Math.sin(angle - Math.PI);

  const xPercent = 50 + x;
  const yPercent = 100 + y;

  sunImg.style.display = "block";
  sunImg.style.left = `${xPercent}%`;
  sunImg.style.top = `${yPercent}%`;
}

async function speichern() {
  suchbegriff = document.querySelector("#suchFeld").value;
  sonnenAufgang = document.querySelector("#sonnenaufgangZeit");
  sonnenUntergang = document.querySelector("#sonnenuntergangsZeit");
  urlOrtschaft = `https://nominatim.openstreetmap.org/search?city=${suchbegriff}&format=json`;

  let ortschaft = await loadOrtschaft(urlOrtschaft);

  if (ortschaft && ortschaft.length > 0) {
    lat = ortschaft[0].lat;
    lon = ortschaft[0].lon;

    let latDMS = convertToDMS(lat, true);
    let lonDMS = convertToDMS(lon, false);

    document.querySelector("#stadtName").textContent = suchbegriff;
    document.querySelector("#stadtLatitude").textContent = latDMS;
    document.querySelector("#stadtLongitude").textContent = lonDMS;

    let sonnenZeitenObjekt = await sonnenZeiten(lat, lon);
    console.log(sonnenZeitenObjekt);

    let timezone = await loadZeitzone(lat, lon);

    // **Neu: UTC-Zeit als Date-Objekt für Positionierung**
    const sunriseDate = parseUtcTimeToDate(sonnenZeitenObjekt.sunrise);
    const sunsetDate = parseUtcTimeToDate(sonnenZeitenObjekt.sunset);

    positioniereSonne(sunriseDate, sunsetDate);

    // **Neu: Lokale Zeitstrings für Anzeige**
    const localSunrise = parseUtcTimeToLocal(
      sonnenZeitenObjekt.sunrise,
      timezone
    );
    const localSunset = parseUtcTimeToLocal(
      sonnenZeitenObjekt.sunset,
      timezone
    );

    sonnenAufgang.textContent = localSunrise;
    sonnenUntergang.textContent = localSunset;
    document.querySelector("#aktuelleZeit").textContent =
      sonnenZeitenObjekt.day_length;
    document.querySelector("#sunriseTime").textContent = localSunrise;
    document.querySelector("#sunsetTime").textContent = localSunset;
    document.querySelector("#duration").textContent =
      sonnenZeitenObjekt.day_length;

    await tagNachtHintergrund(lat, lon);
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

async function loadZeitzone(lat, lon) {
  const apiKey = "2c38ca7b51824cedb4d9af17df73dbd6";
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.features[0].properties.timezone.name;
  } catch (error) {
    console.error("Fehler beim Laden der Zeitzone:", error);
    return "UTC";
  }
}

// **ENTFERNT: alte convertUTCToLocalTime, da jetzt eigene Umrechnung mit parseUtcTimeToLocal**
