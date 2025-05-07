//Suchbegriff, der in das Suchfeld gegeben wird, wird in einer Variabel gespeichert
let suchbegriff = "";
let urlOrtschaft = "";

function speichern() {
  suchbegriff = document.querySelector("#suchFeld").value;
  urlOrtschaft = `https://nominatim.openstreetmap.org/search?city=${suchbegriff}&format=json`;
}

// Button wird in eine Variabel gespeichert + mit dem Klick auf "Suchen" werden die Daten gefeched
const buttonSuche = document.querySelector("#suchButton");
buttonSuche.addEventListener("click", function ladeDatenOrt() {
  speichern();
  alert("Test");
});

//Alert wird nicht angezeigt
// Vorlage Pokemon
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
