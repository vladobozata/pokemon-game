import style from './UI/CustomStyle.js'
export default class PokemonCard extends PIXI.Sprite {
    constructor(pokemon_instance) {
        super();
        this.pokemon = pokemon_instance;

        const pokemonWidth = 96;
        const cardWidth = 120;
        const cardHeight = 200;
        const pokemon_back = new PIXI.Sprite(pokemon_instance.textures.back);

        pokemon_back.x = (cardWidth - pokemonWidth)/2; 
        pokemon_instance.x += (cardWidth - pokemonWidth)/2; 

        this.text_style = this.generateStyle();
        this.cardBackground = this.generateCard(cardWidth, cardHeight);

        this.cardFront = new PIXI.Container;
        this.cardBack = new PIXI.Container;
        this.cardBack.visible = false;
        this.view = "front";


        this.cardFront.addChild(pokemon_instance);      
        this.cardBack.addChild(pokemon_back)
        this.addChild(this.cardBackground);
        this.addChild(this.cardFront);
        this.addChild(this.cardBack);

        let tags = this._loadAllTags_(pokemon_instance);

        Object.keys(tags.front).forEach(key => {
            this.cardFront.addChild(tags.front[key]);
        })

        for(const index in tags.back) {
            this.cardBack.addChild(tags.back[index]);
        }

        this.interactive = true;
        // this.on('click', this.flipCard);

    }
    flipCard()  {
        if (this.view === "front") {
            this.cardFront.visible = false;
            this.cardBack.visible = true;
            this.view = "back";
        } else if (this.view === "back") {
            this.cardFront.visible = true;
            this.cardBack.visible = false;
            this.view = "front";
        }
    }

    select(state) {
        if(state) this.alpha = 2;
        else this.alpha = 1;
    }

    _loadAllTags_(instance){
        let frontTags = {};
        let backTags = [];
        let offsetX = 10;
        let offsetY = 90;
        let _this = this;


        //Front tags:
        addFrontTag("name", instance.name);
        addFrontTag("ability", instance.ability);
        offsetY += 6
        addFrontTag("hp", instance.stats.hp);
        addFrontTag("attack", instance.stats.attack);
        addFrontTag("defense", instance.stats.defense);
        addFrontTag("spec att", instance.stats["special-attack"]);
        addFrontTag("spec def", instance.stats["special-defense"]);
        addFrontTag("speed", instance.stats.speed);

        function addFrontTag(tag, text) {
            frontTags[tag] = _this.generateTag(`${tag} - ${text}`, [offsetX, offsetY]);
            offsetY += 12;
        }

        //Card back tags:

        backTags[0] = this.generateTag("moves",[45,100]);
        
        offsetY = 120;
        for (const index in instance.moves) {
            let moveIndex= parseInt(index) + 1;
            addBackMove(`${moveIndex}: ${instance.moves[index]}`, moveIndex);
            offsetY += 20;
        }

        function addBackMove(text, moveIndex){
            backTags[moveIndex] = _this.generateTag(text, [offsetX, offsetY]);
        }


        return {"front": frontTags, "back": backTags};
    }


    generateCard(width, height) {
        let card = new PIXI.Graphics();
        card.lineStyle(2, 0xFFFFFF);
        card.beginFill(0xFFFFFF, 0.80);
        card.drawRoundedRect(0,0,width,height, 10);

        return card;
    }

    generateTag(text, position) {
        let tag = new PIXI.Text(text, this.text_style);
        tag.position.set(position[0], position[1]);
        
        return tag;
    }
    generateStyle() {
        const style = new PIXI.TextStyle({
            align: "left",
            breakWords: true,
            fontFamily: "Helvetica",
            fontSize: 11,
            fontVariant: "small-caps",
            fontWeight: 600,
            // wordWrap: true,
            // wordWrapWidth: 110
        })
        return style;
    }

}
