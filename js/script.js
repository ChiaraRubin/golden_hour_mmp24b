const sonnenaufgang = await loadSonnenaufgang();
const sonnenuntergang = await loadSonnenuntergang();
const tageslaenge = await taegesLaenge();
const jetzt = new Date();
const stunden = jetzt.getHours();
const minuten = jetzt.getMinutes();
const sekunden = jetzt.getSeconds();

console.log(`Aktuelle Uhrzeit: ${stunden}:${minuten}:${sekunden}`);

// Sonnenaufgang laden
async function loadSonnenaufgang() {
  const urlSunriseSunset =
    "https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400";
  try {
    const response = await fetch(url);
    const answer = await response.json();
    return answer.results;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Sonnenuntergang laden
async function loadSonnenuntergang() {
  const urlSunriseSunset =
    "https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400";
  try {
    const response = await fetch(url);
    const answer = await response.json();
    return answer.results;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// Tageslänge laden
async function taegesLaenge() {
  const urlSunriseSunset =
    "https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400";
  try {
    const response = await fetch(url);
    const answer = await response.json();
    return answer.results;
  } catch (error) {
    console.error(error);
    return false;
  }
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

// Vorlage Pokemon
const all_pokemon = await loadPokemon();
let all_pokemon_with_details = [];

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
