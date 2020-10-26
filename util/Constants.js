/*
The max pokemon count <POKEMON_NUMBER> was experimentally proven to
differ form the value provided by pokeapi.co,
which is why it is defined as a constant, 
rather than derived from an api response.

On a side note, pokemon above ID#810~ seem to lack any
abilities or moves.
*/

export const POKEMON_NUMBER = 893;
export const POKEMON_PER_PAGE = 8;
export const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/";
export const SEARCH_URL = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=8";
