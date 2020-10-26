export default class Pokemon extends PIXI.Sprite  {
    constructor({id, name, ability, moves, stats, textures}) {
        super(textures.front);
        
        this.id = id;
        this.name = name;
        this.ability = ability;
        this.moves = moves;
        this.stats = stats;
        this.textures = textures;
        this.currentHP = stats["hp"];
    }
}