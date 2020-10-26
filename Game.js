import Loader from './util/AssetLoader.js';
import SelectionScene from './scenes/SelectionScene.js';
import BattleScene from './scenes/BattleScene.js';
import EndScene from './scenes/EndScene.js';


class Game {
    constructor(){
        
        
        this.phase = "selection";

        this.selectionScene = new SelectionScene();
        this.battleScene = new  BattleScene();
        this.endScene = new EndScene();

        this.initializeApp();
    }

    initializeApp() {
        let appWidth = 600;
        let appHeight = 500;
    
        // Stage initialization
        this.app = new PIXI.Application({width:appWidth, height:appHeight});
        this.app.stage.addChild(this.selectionScene);    
        this.app.stage.addChild(this.battleScene);    
        this.app.stage.addChild(this.endScene);    
        
        this.loader = new Loader();
        
        // Ticker setup
        this.app.ticker.stop();
        gsap.ticker.add(() => this.app.ticker.update());
        document.body.appendChild(this.app.view);

        // Event listeners
        this.selectionScene.navigation.buttonPrev.on('pointerdown', e => this.navigate(e));
        this.selectionScene.navigation.buttonNext.on('pointerdown', e => this.navigate(e));
        this.selectionScene.navigation.buttonPick.on('pointerdown', () => this.advance('battle'));
        

        this.advance('select')
    }

    async advance (stage) {
        if(stage==='select'){
            this.endScene.stop();
            this.selectionScene.start();
            this.navigate();
        } else
        if(stage==="battle") {
            let pokemonSelected = this.selectionScene.cardSelected.pokemon;
            let randomOpponent = await this.loader.getRandom();

            let name = this.selectionScene.cardSelected.pokemon.name;

            this.selectionScene.stop();
            this.battleScene.start(pokemonSelected, randomOpponent)
            .then( () => this.advance('end'));
        } else
        if(stage==="end") {
            const scenario = this.battleScene.endScenario;

            this.battleScene.stop();
            this.endScene.start(scenario);

            this.endScene.resetButton
            .on('pointerdown', () => this.advance('select'));

        } 
    }

    async navigate (event) {
        let cards = [];
        if (event) {
            this.selectionScene.cardsLoaded.removeChildren();
            this.selectionScene.navigation.changeVisible('pick', false);
            this.selectionScene.navigation.toggleButtons(false);
            cards = await this.loader.browse(event.target.name);
            this.selectionScene.displaySelection(cards);
            this.selectionScene.navigation.toggleButtons(true);
        } else {
            cards = await this.loader.browse('default');
            this.selectionScene.displaySelection(cards);
        }

    }
}

new Game();
