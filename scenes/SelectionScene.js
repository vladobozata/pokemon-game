import Navigation from "../UI/Navigation.js";

export default class SelectionScene extends PIXI.Container  {

    constructor(){
        super();

        this.cardSelected;
        this.cardsLoaded = new PIXI.Container();
        this.navigation = new Navigation();

    }
    start () {
        
        this.addChild(this.navigation);
        this.addChild(this.cardsLoaded);
        this.visible = true;
    }

    stop () {
        this.navigation.changeVisible('pick', false);
        this.navigation.changeVisible('prev', false);
        this.removeChildren();
        this.cardsLoaded.removeChildren();
        this.cardSelected = null;
        this.visible = false;
    }
    
    displaySelection(cards) {
        
        let offsetX = 35;
        let offsetY = 15;

        for(let i=0; i<cards.length; i++) {
            let card = cards[i];
            card.x += offsetX;
            card.y += offsetY;
            card.on('click', event => this._selectCard_(event.target));

            // this.cardsLoaded.push(card);
            this.cardsLoaded.addChild(card);        

            let next = i+1;
            if((next/4 > 0) && (next%4===0)) {
                offsetX = 35;
                offsetY += 210;
            } else offsetX += 135;
        }
    }

 

    _selectCard_(card){
        this.navigation.changeVisible('pick', true);
        if(this.cardSelected) {
            this.cardSelected.select(false);
            let cardName = card.pokemon.name;
            let selectedName = this.cardSelected.pokemon.name;
            let flipped = this.cardSelected.view == "back";
            if(cardName != selectedName && flipped) {
                this.cardSelected.flipCard();
            }
        }
        card.flipCard();
        this.cardSelected = card;        
        this.cardSelected.select(true);        
    }
}
