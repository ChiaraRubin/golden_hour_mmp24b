//Suchbegriff, der in das Suchfeld gegeben wird, wird in einer Variabel gespeichert
let suchbegriff = "";
let urlOrtschaft = "";
let sonnenAufgang = "";
let sonnenUntergang = "";
let aktuelleTageszeit = "";
let urlSonnenstand = "";

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

//----------------------------------------------------------------------------
// Vorlage Pokemon
/*
const all_pokemon = await loadPokemon();
let all_pokemon_with_details = [];

try {
  const response = await fetch(url);
  const answer = await response.json();
  return answer.results;
} catch (error) {
  console.error(error);
  return false;
}

// pokemon loader
async function loadPokemon() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=9&offset=0"; // mit korrekter API-URL ersetzen
  try {
    const response = await fetch(url);
    const answer = await response.json();
    return answer.results;
  } catch (error) {
    console.error(error);
    return false;
  }
}
async function loadPokemonDetails(url) {
  try {
    const response = await fetch(url);
    const answer = await response.json();
    // array all_pokemon_with_details mit den details aus den detaildaten befüllen
    return {
      name: answer.name,
      image: answer.sprites.front_default,
      hp: answer.stats[0].base_stat,
      type: answer.types[0].type.name,
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}
for (const [key, pokemon] of all_pokemon.entries()) {
  const details = await loadPokemonDetails(pokemon.url);
  all_pokemon_with_details.push(details);
}

// unsere pokemon ins HTML/DOM einfüllen
const cards_container = document.querySelector("#cards");
all_pokemon_with_details.forEach((pokemon) => {
  const card = `<div class="card">
                <h2 class="pokemon_name">${pokemon.name}</h2>
                <img class="pokemon_image" src="${pokemon.image}" alt="">
                <p class="pokemon_hp">Lebenskraft: <span class="value_hp">${pokemon.hp}</span></p>
            </div>`;
  cards_container.innerHTML += card;
});
*/
