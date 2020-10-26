import Parser from './Parser.js';
import {POKEMON_NUMBER, POKEMON_URL, SEARCH_URL} from './Constants.js';

export default class AssetLoader {
    constructor() {
        this._prevPageURL_ = null;
        this._nextPageURL_ = null;
        this.isPrevPage = false;
        this.isNextPage = false;
    }
    
    browse(direction){
        // Determine the url to use for loadPage()
        let url;
        switch(direction) {
            case "next":
                if(!this.isNextPage) return;
                url = this._nextPageURL_;
                break;
            case "prev":
                if(!this.isPrevPage) return;
                url = this._prevPageURL_;
                break;
            default:
                url = SEARCH_URL;
                break;
        }
        const cards = this._loadPage_(url);
        return cards;
    }

    getRandom(exceptionID) {
        let randomID = Math.floor(Math.random()*POKEMON_NUMBER);
    
        if(randomID===exceptionID) {
            if(randomID<POKEMON_NUMBER) randomID++;
            else randomID--;
            console.log(`randomID updated: ${randomID}`);
        }
        
        let pokemon = this._loadSingle_(randomID);
        return pokemon;
    }


    _updateLinks_(response){
        // Update the links to next/previous page

        this._nextPageURL_ = response.next;
        this._prevPageURL_ = response.previous;
        
        this.isNextPage = this._nextPageURL_? true:false;
        this.isPrevPage = this._prevPageURL_? true:false;
    }

    async _loadSingle_(id) {
        // Send request for 1 pokemon by id
        // Used to generate a random pokemon for an opponent during battle phase
        const url = POKEMON_URL + id;
        let pokemonData = await this._fetchPokemonData_([url]);
        pokemonData = pokemonData[0];
        const textures = await this._getTextureFromEntry_(pokemonData);
        pokemonData.textures = {front: textures[0], back: textures[1]};
        const pokemon = Parser.generatePokemon(pokemonData);

        return pokemon;
    }

    async _loadPage_(url) {
        // Send a request for 8 pokemon urls
        // Updata next and previous page links (if available)
        let resources = []
        let response = await fetch(url).then(r => r.json());
        response.results.forEach(pokemonLink => {
            resources.push(pokemonLink.url);
        })
        
        this._updateLinks_(response);
        
        // Send request for 8 pokemon data files
        // Loop through each, checking for available texture URL-s
        // Download available textures and store them in the entry
        // Retrieve a pokemon card using the data entry
        let pokemonData = await this._fetchPokemonData_(resources);
        let pokemonCards = [];
        for (let i = 0; i < pokemonData.length; i++) {
            const entry = pokemonData[i];
            const wrapper = await this._getTextureFromEntry_(entry);
            entry.textures = {front: wrapper[0], back: wrapper[1]};
            let card = Parser.generatePokemonCard(entry);
            pokemonCards.push(card);
        }
        return Promise.all(pokemonCards);
    }

    async _fetchPokemonData_(urls) {
        // Get array of JSON files containing data on a specific pokemon:

        let requests = [];
        for (let i = 0; i < urls.length; i++) {
            let pokemon = fetch(urls[i])
            .then(response => response.json());
            requests.push(pokemon);
        }
        return Promise.all(requests);
    }

    _getTextureFromEntry_(dataEntry){
        // Extract a texture url from a data entry, check for errors 
        // and download the texture:
        let front = dataEntry.sprites.front_default;
        let back = dataEntry.sprites.back_default;
        let urls = check_available(front,back);

        front = fetchTexture(urls[0]);
        back = fetchTexture(urls[1]);

        return Promise.all([front,back]);

        function check_available(front, back) {
            // Check for front and back textures
            // If either is unavailable, replace with the other
            // If neither is available, replace with pikachu textures
            
            let frontURL = (back && !front)? back:front;
            let backURL= (front && !back)? front:back;
            if(!front && !back) {1
                const pikachu_front = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";
                const pikachu_back = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png";
                frontURL = pikachu_front;
                backURL = pikachu_back;
            }
            return [frontURL,backURL];
        }

        function fetchTexture(url) {
            // Fetch <PIXI.Texture> from a url
            let texture = fetch(url)
            .then(response => response.blob())
            .then(blob => URL.createObjectURL(blob))
            .then(bloburl => {
                return new PIXI.Texture.from(bloburl);
            });
            
            return texture;
        }
    }
}