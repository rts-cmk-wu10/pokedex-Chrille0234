const URL = 'https://pokeapi.co/api/v2/pokemon/'

const types = document.querySelector('#types')
const abilities = document.querySelector('#abilities')
const name = document.querySelector('#name')
const strength = document.querySelector('#strength')
const description = document.querySelector('#description')
const image = document.querySelector('#image')

const form = document.querySelector('form')
const searchResults = document.querySelector('.searchResults')
form.addEventListener('submit', e => e.preventDefault())

const search = document.querySelector('#searchInput')
const searchButton = document.querySelector('#searchButton')
const searchSpan = document.querySelector('#notFoundMessage')
searchButton.addEventListener('click', () => searchPokemon(search.value))

let pokemonCount;
const pokeAPI = new Pokedex.Pokedex()
pokeAPI.getPokemonsList()
.then(data => {
    pokemonCount = data.count
}) 

let offset = 0

function nextPage(){ 
    if (offset + 20 > pokemonCount) return
    offset += 20
    getPokemons()
}

function previousPage(){
    if(offset === 0) return
    offset -= 20
    getPokemons()
}

function searchPokemon(value){
    searchResults.innerHTML = ''
    fetch(URL + value)
    .then(res => {
        if(res.status === 200){
            searchSpan.innerHTML = ''
            return res.json()

        }else{
            searchSpan.innerHTML = 'hovsa, prøv igen'
            return getPokemons()
        }
    })
    .then(data => {
        console.log(data)
        const SECTION = document.createElement('section')
        SECTION.classList.add('pokemonCard')
        SECTION.id = data.name
        SECTION.addEventListener('click', () => updateInfo(data))

        SECTION.innerHTML = `
        <h2>${data.name}</h2>
        <img src="${data.sprites.front_default}">
        <p>Højde: ${data.height}</p>
        <p>Vægt: ${data.weight}</p>
        <p>Erfaring: ${data.base_experience}</p>
        `
        document.getElementById
        searchResults.appendChild(SECTION)
    })
}
function putAllPokemonsInList(){
    fetch(URL + '?limit=10000')
    .then(res => res.json())
    .then(data => {
        data.results.forEach(pokemon => {
            const OPTION = document.createElement('option')
            OPTION.value = pokemon.name
            OPTION.innerHTML = pokemon.name
            document.getElementById("pokemonsList").appendChild(OPTION)
        })
    })
}

function getPokemons(){
    const pokeAPI = new Pokedex.Pokedex()
    searchResults.innerHTML = ''
    fetch(URL + `?offset=${offset}`)
    .then(res => {
        if(res.status !== 200){
            throw new Error("Hvad fuck sker der?")
        }
        return res.json()
    })
    .then(data => {
        data.results.forEach(pokemon => {
            pokeAPI.getPokemonByName(pokemon.name)
            .then(data => {
                const SECTION = document.createElement('section')
                SECTION.classList.add('pokemonCard')
                SECTION.id = data.name
                SECTION.addEventListener('click', () => updateInfo(data))

                SECTION.innerHTML = `
                <h2>${data.name}</h2>
                <img src="${data.sprites.front_default}">
                <p>Højde: ${data.height}</p>
                <p>Vægt: ${data.weight}</p>
                <p>Erfaring: ${data.base_experience}</p>
                `
                searchResults.appendChild(SECTION)
            })
        })
    })
    .catch(err => console.log(err))
}
function updateInfo(pokemonData) {
    name.innerHTML = pokemonData.name;
    strength.innerHTML = pokemonData.base_experience;
    description.innerHTML = pokemonData.weight;
    image.src = pokemonData.sprites.front_default;
    image.alt = pokemonData.name;
    types.innerHTML = pokemonData.types
        .map(type => `<li>${type.type.name}</li>`)
        .join('-');
    abilities.innerHTML = pokemonData.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('-');
}


getPokemons()
putAllPokemonsInList()