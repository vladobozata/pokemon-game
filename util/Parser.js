import Pokemon from "../Pokemon.js";
import PokemonCard from "../PokemonCard.js";

export default class Parser {
    static async generatePokemonCard(pokemonEntry) {
        const pokemon = await this.generatePokemon(pokemonEntry);
        const card = new PokemonCard(pokemon);

        return card; 
    }

    static async generatePokemon(pokemonEntry) {
        // Converts pokemon api response to PokemonCard object:
        
        // Check entry for provided abilities and/or moves
        // 1) Check for available moves and abilities, since some Pokemon don't have any
        const all_abilities = pokemonEntry.hasOwnProperty("abilities")? pokemonEntry.abilities:undefined;
        const all_moves = pokemonEntry.hasOwnProperty("moves")? pokemonEntry.moves:undefined;
        
        // 2) Extract all relevant information from the data entry
        const id = pokemonEntry.id;
        const name = pokemonEntry.name;
        const ability = Parser._extractAbility_(all_abilities);
        const moves = Parser._extractMoves_(all_moves);
        const stats = Parser._extractStats_(pokemonEntry.stats);
        const textures = pokemonEntry.textures;
        
        // 3) Combine all data into an object
        // 4) Use the data object to initialize a <new Pokemon()> Sprite
        // 5) Use the Sprite to create a PokemonCard
        const pokemonObject = {id, name, ability, moves, stats, textures};
        const pokemon = new Pokemon(pokemonObject);
        return pokemon;
    }

    static _extractAbility_ (abilitiesArray) {
        // Finds first non-hidden ability of a pokemon
        if(!abilitiesArray.length) return "none";

        for (let ability of abilitiesArray) {
            if(ability.isHidden) continue;
            else if(!ability.isHidden) return ability["ability"].name;
        }

        console.log("Visible ability not found. Returning last ability.");
        return abilities[abilities.length-1];
    }

    static _extractMoves_ (movesArray) {
        // Finds first four moves
        if(!movesArray.length) return ['none', 'none', 'none', 'none'];

        let moves = [];
        for (let index = 0; index < 4; index++) {
            moves.push(movesArray[index]["move"].name);
        }
        return moves;
    }
    
    static _extractStats_ (statsArray) {
        // Creates an object containing all stat names and values
        let stats = {};
        for(let element of statsArray) {
            stats[element.stat.name] = element.base_stat;
        }
        return stats;
    }
}
