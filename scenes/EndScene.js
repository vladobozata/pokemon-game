import Element from '../UI/UI_Element.js';

export default class EndScene extends PIXI.Container {
    constructor() {
        super();

        this.gameOverText;
        this.resetButton;
    }

    start(scenario) {
        const textWidth = 250, textHeight = 100;
        const buttonWidth = 100, buttonHeight = 50;

        this.gameOverText = new Element(textWidth,textHeight, `You ${scenario}!`, false, 25);
        this.gameOverText.pivot.set(textWidth/2, textHeight/2);
        this.resetButton = new Element(buttonWidth, buttonHeight, `Play Again`, true);
        this.resetButton.pivot.set(buttonWidth/2, buttonHeight/2);
        this.resetButton.interactive = true;
        this.resetButton.buttonMode = true;

        this.gameOverText.position.set(300,150);
        this.resetButton.position.set(300,400);

        this.addChild(this.gameOverText);
        this.addChild(this.resetButton);
        this.visible = true;
    }

    stop() {
        this.visible = false;
        this.removeChildren();
    }

}