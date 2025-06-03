// Variabeln definieren
let suchbegriff = "";
let urlOrtschaft = "";
let sonnenAufgang = "";
let sonnenUntergang = "";
let backgroundColor = document.querySelector("body");
let clockInterval;
let currentTimezone = null;

// Uhrzeit-Funktion (aktualisiert die Anzeige der Uhrzeit im gewünschten Zeitformat)
function updateClock() {
  const now = new Date();
  let timeString;

  if (currentTimezone) {
    // Zeit der gesuchten Stadt anzeigen
    timeString = now.toLocaleTimeString("de-DE", {
      timeZone: currentTimezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } else {
    // Lokale Zeit anzeigen
    timeString = now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  document.querySelector("#uhrzeit").textContent = timeString;
}

// Uhrzeit sofort starten
updateClock();
clockInterval = setInterval(updateClock, 1000);

// Funktion zur Formatierung der Tageslänge in Stunden und Minuten
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}:${minutes.toString().padStart(2, "0")} h`;
}

// Funktion, um Daten für den Sonnenauf- und untergang abzurufen
async function getSunriseSunset(lat, lon) {
  const timezone = await loadZeitzone(lat, lon);

  const apiUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  const sunrise = new Date(data.results.sunrise);
  const sunset = new Date(data.results.sunset);

  return {
    // Datenumwandlung zur besseren Darstellung (lokale Zeitformate für Sonnenaufgang und -untergang)
    sunriseLocal: sunrise.toLocaleTimeString("de-DE", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    sunsetLocal: sunset.toLocaleTimeString("de-DE", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    sunriseDate: sunrise,
    sunsetDate: sunset,
    duration: formatDuration(data.results.day_length),
    timezone: timezone,
  };
}

//Hintergrundanpassung, je nachdem, ob es Tag oder Nacht ist
async function tagNachtHintergrund(lat, lon) {
  try {
    const sunData = await getSunriseSunset(lat, lon);

    // Aktuelle Zeit in der lokalen Zeitzone als Minuten seit Mitternacht
    const now = new Date();
    const currentTimeInZone = now.toLocaleTimeString("de-DE", {
      timeZone: sunData.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    // Konvertiere alle Zeiten zu Minuten seit Mitternacht für einfachen Vergleich
    function timeToMinutes(timeString) {
      const [hours, minutes] = timeString.split(":").map(Number);
      return hours * 60 + minutes;
    }

    const currentMinutes = timeToMinutes(currentTimeInZone);
    const sunriseMinutes = timeToMinutes(sunData.sunriseLocal);
    const sunsetMinutes = timeToMinutes(sunData.sunsetLocal);

    // Prüfe, ob es Tag ist
    const isDay =
      currentMinutes >= sunriseMinutes && currentMinutes <= sunsetMinutes;
    const isNight = !isDay;

    // Style-Anpassungen
    if (isNight) {
      document.querySelector("body").style.backgroundColor = "#2b2b2b";
      document.querySelector("#titelWebsite").style.color = "#ECD2C3";
      document.querySelector("#stadtName").style.color = "#ECD2C3";
      document.querySelector("#latitudeLongitude").style.color = "#ECD2C3";
      document.querySelector("#sonnenInfo").style.color = "#ECD2C3";
      document.querySelector("#aktuelleUhrzeit").style.color = "#ECD2C3";
    } else {
      document.querySelector("body").style.backgroundColor = "#edc9ad";
      document.querySelector("#titelWebsite").style.color = "#563723";
      document.querySelector("#stadtName").style.color = "#563723";
      document.querySelector("#latitudeLongitude").style.color = "#563723";
      document.querySelector("#sonnenInfo").style.color = "#563723";
      document.querySelector("#aktuelleUhrzeit").style.color = "#563723";
    }
  } catch (error) {
    console.error("Fehler bei Tag/Nacht Berechnung:", error);
  }
}

let lat, lon;
// Wandelt dezimale Koordinaten in DMS-Format (Grad, Minuten, Sekunden) um
function convertToDMS(decimal, isLat) {
  const dir = decimal >= 0 ? (isLat ? "N" : "E") : isLat ? "S" : "W";
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = ((minutesFloat - minutes) * 60).toFixed(2);

  return `${degrees}° ${minutes}' ${seconds}″ ${dir}`;
}
// Positioniert die Sonne entlang des Sonnenbogens, wenn sie am Himmel sichtbar ist
function positioniereSonne(sunriseDate, sunsetDate) {
  const sunImg = document.querySelector("#sun");
  const bogen = document.querySelector("#sonnenstandBogen");
  const now = new Date();

  if (now < sunriseDate || now > sunsetDate) {
    sunImg.style.display = "none";
    return;
  }

  // Berechnet Fortschritt des Tages (Sonnenlauf) als Prozentwert
  const totalDuration = sunsetDate - sunriseDate;
  const currentDuration = now - sunriseDate;
  const progress = currentDuration / totalDuration;
  console.log(`Sonnenposition: ${(progress * 100).toFixed(1)}% des Tages`);

  // Berechnet x- und y-Koordinaten der Sonne basierend auf dem Tagesfortschritt (trigonometrisch)
  const bogenRadius = 75;
  const angle = Math.PI - progress * Math.PI;
  const x = bogenRadius * Math.cos(angle);
  const y = bogenRadius * Math.sin(angle);

  const bogenCenterX = 75;
  const bogenCenterY = 75;

  const finalX = ((bogenCenterX + x) / 150) * 100;
  const finalY = ((bogenCenterY - y) / 150) * 100;

  sunImg.style.display = "block";
  sunImg.style.left = `${finalX}%`;
  sunImg.style.top = `${finalY}%`;
  sunImg.style.position = "absolute";

  console.log(
    `Sonne positioniert bei: ${finalX.toFixed(1)}%, ${finalY.toFixed(
      1
    )}% (relativ zum Bogen)`
  );
}

// Prüft, ob ein Suchbegriff eingegeben wurde, andernfalls gibt es einen Hinweis in der Konsole
async function speichern() {
  try {
    suchbegriff = document.querySelector("#suchFeld").value;

    if (!suchbegriff) {
      console.log("Bitte eine Stadt eingeben.");
      return;
    }

    sonnenAufgang = document.querySelector("#sonnenaufgangZeit");
    sonnenUntergang = document.querySelector("#sonnenuntergangsZeit");
    urlOrtschaft = `https://nominatim.openstreetmap.org/search?city=${suchbegriff}&format=json`;

    let ortschaft = await loadOrtschaft(urlOrtschaft);

    if (ortschaft && ortschaft.length > 0) {
      // Koordinaten ermitteln und anzeigen
      lat = parseFloat(ortschaft[0].lat);
      lon = parseFloat(ortschaft[0].lon);

      let latDMS = convertToDMS(lat, true);
      let lonDMS = convertToDMS(lon, false);

      document.querySelector("#stadtName").textContent = suchbegriff;
      document.querySelector("#stadtLatitude").textContent = latDMS;
      document.querySelector("#stadtLongitude").textContent = lonDMS;
      // Sonnenzeiten abrufen und anzeigen
      const sunData = await getSunriseSunset(lat, lon);
      currentTimezone = sunData.timezone;

      sonnenAufgang.textContent = sunData.sunriseLocal;
      sonnenUntergang.textContent = sunData.sunsetLocal;
      document.querySelector("#aktuelleZeit").textContent = sunData.duration;
      document.querySelector("#sunriseTime").textContent = sunData.sunriseLocal;
      document.querySelector("#sunsetTime").textContent = sunData.sunsetLocal;
      document.querySelector("#duration").textContent = sunData.duration;

      // Sonne auf Bogen positionieren
      positioniereSonne(sunData.sunriseDate, sunData.sunsetDate);

      // Tag-/Nacht-Hintergrund setzen
      await tagNachtHintergrund(lat, lon);
    } else {
      console.log("Keine Daten für diese Stadt gefunden.");
      alert(
        "Stadt nicht gefunden. Bitte versuchen Sie es mit einer anderen Stadt."
      );
    }
  } catch (error) {
    console.error("Fehler beim Laden der Stadtdaten:", error);
    alert("Fehler beim Laden der Daten. Bitte versuchen Sie es erneut.");
  }
}

const buttonSuche = document.querySelector("#suchButton");
// Klick auf den Such-Button löst Datenabfrage aus
buttonSuche.addEventListener("click", function ladeDatenOrt() {
  speichern();
});

document
  .querySelector("#suchFeld")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      speichern();
    }
  });

// Lädt Ortsdaten (Koordinaten) basierend auf dem eingegebenen Stadtnamen
async function loadOrtschaft(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fehler beim Laden der Ortschaft:", error);
    return false;
  }
}

// Holt die Zeitzone über die Geocoding-API.
async function loadZeitzone(lat, lon) {
  const apiKey = "2c38ca7b51824cedb4d9af17df73dbd6";
  // API-Aufruf zur Ermittlung der Zeitzone anhand der Koordinaten
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.features[0].properties.timezone.name;
  } catch (error) {
    console.error("Fehler beim Laden der Zeitzone:", error);
    return getTimezoneFromCoordinates(lat, lon);
  }
}

// Notlösung: Wenn die Zeitzone nicht geladen werden kann, wird sie ungefähr aus den Koordinaten berechnet
function getTimezoneFromCoordinates(lat, lon) {
  // Einfache Zeitzonenbestimmung basierend auf Längengrad
  const offset = Math.round(lon / 15);

  // Einige bekannte Zeitzonen für bessere Genauigkeit
  if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 40) {
    // Europa
    if (lon >= -10 && lon <= 5) return "Europe/London";
    if (lon >= 5 && lon <= 15) return "Europe/Berlin";
    if (lon >= 15 && lon <= 30) return "Europe/Warsaw";
    if (lon >= 30 && lon <= 40) return "Europe/Moscow";
  }

  // Notlösung: Verwendet UTC-Zeit mit Zeitverschiebung (Offset)
  if (offset === 0) return "UTC";
  return offset > 0 ? `Etc/GMT-${offset}` : `Etc/GMT+${Math.abs(offset)}`;
}
