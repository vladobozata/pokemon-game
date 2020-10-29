const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
const SEARCH_URL = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=8";
const ID_START=40, ID_END=48;
let nextPageURL,
prevPageURL;


async function fetchPokemon(urls) {
    let requests = [];
    for (let i = 0; i < urls.length; i++) {
        let pokemon = fetch(urls[i])
        .then(response => response.json());
        requests.push(pokemon);
    }
    return Promise.all(requests);
}
// async function fetchPokemon(from, to) {
//     let requests = [];
//     for (let i = from; i < to; i++) {
//         let url = POKEMON_URL + i;

//         let pokemon = fetch(url)
//         .then(response => response.json());

//         requests.push(pokemon);
//     }
//     return Promise.all(requests);
// }
 
async function fetchTexture(urls) {
    //For each sprite url in urls[], make an API call to retrieve the texture.
    let textures = [];

    urls.forEach( url => {
        texture = fetch(url)
        .then(response => response.blob())
        .then(blob => URL.createObjectURL(blob))
        .then(bloburl => new PIXI.Texture.from(bloburl))
        textures.push(texture);
    })
    return Promise.all(textures);
}


function extractAbility(abilitiesArray) {
    for (ability of abilitiesArray) {
        if(ability.isHidden) continue;
        else if(!ability.isHidden) return ability["ability"].name;
    }

    console.log("Visible ability not found. Returning last ability.");
    return abilities[abilities.length-1];
}

function extractMoves(movesArray) {
    let moves = [];
    for (let index = 0; index < 4; index++) {
        moves.push(movesArray[index]["move"].name);
    }
    return moves;
}
function extractStats(statsArray) {
    let stats = {};
    for(element of statsArray) {
        stats[element.stat.name] = element.base_stat;
    }
    return stats;
}

async function extractPokemon(urls) {
    //Array of pokemon in JSON:
    let pokemon = await fetchPokemon(urls);
    //Array of urls for the front & back pokemon textures

    let textureURL_front = [], textureURL_back = [];

    pokemon.forEach(entry => {
        if(entry.sprites.front_default)
        textureURL_front.push(entry.sprites.front_default);
        else textureURL_front = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";
        //If no front or back sprite is available, load the texture for Pikachu
        if(entry.sprites.back_default)
        textureURL_back.push(entry.sprites.back_default);
        else textureURL_back = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png";
    })


    // textureURL_front = pokemon.map( entry => entry.sprites.front_default);
    // textureURL_back = pokemon.map( entry => entry.sprites.back_default);

    //Array for the textures themselves
    let texture_front = await fetchTexture(textureURL_front);
    let texture_back;
    try {
        texture_back = await fetchTexture(textureURL_back);
    } catch (error) {
        console.error("Failed to get back texture!");
        texture_back = texture_front
    }

    //Arrays for the required stats
    let id = pokemon.map(entry => entry.id);
    let name = pokemon.map(entry => entry.name);

    // Some pokemon lack abilities and moves, hence
    // the necessity for a try-catch block here.
    let ability, moves;
    try {
        ability = pokemon.map(entry => extractAbility(entry.abilities));
    } catch (error) {
        // console.error(error);
        console.error("No abilities found for "+name);
        ability = 'none'
    }
    try {
        moves = pokemon.map(entry => extractMoves(entry.moves));
    } catch (error) {
        // console.error(error);
        console.error("No moves found for "+name);
        moves = ['none', 'none', 'none', 'none'];
    }

    let stats = pokemon.map(entry => extractStats(entry.stats));

    let parameters = {id, name, ability, moves, stats, texture_front, texture_back};

    // Each index in pokemon[] is mapped to all other parameters{} arrays.
    // This loop combines matching indexes among parameters into separate objects.
    // The objects are also combined in an array dataObjects[], later used for initialization.
    let dataObjects = []
    for (let index = 0; index < pokemon.length; index++) {
        dataObject = {};
        for (arrayName in parameters) {
            dataObject[arrayName] = parameters[arrayName][index];
        }
        dataObjects.push(dataObject);
    }


    let cardsArray = [];
    dataObjects.forEach(construct => {
        let p = new Pokemon(construct);
        let card = new PokemonCard(p);
        cardsArray.push(card);
    })

    return cardsArray; 
}

async function loadURL(direction) {
    console.log(direction);
    let url;
    let resources_URL = []


    switch(direction) {
        case "next":
            url = nextPageURL;
            currentPage++;
            break;
        case "prev":
            url = prevPageURL;
            currentPage--;
            break;
        default:
            url = SEARCH_URL;
            break;
    }

    response = await fetch(url).then(r => r.json());

    nextPageURL = response.next? response.next:null;
    prevPageURL = response.previous? response.previous:null;

    if(nextPageURL) updateNavigation('enable','next');
    else updateNavigation('disable','next');
    if(prevPageURL) updateNavigation('enable','prev');
    else updateNavigation('disable','prev');
    

    response.results.forEach(element => {
        resources_URL.push(element.url);
    })
    return resources_URL;
}


async function initializeAssets() {
    response = await fetch(SEARCH_URL).then(r => r.json());
    currentPage = 1;
    nextPageURL = response.next;
}
