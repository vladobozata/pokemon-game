// import * as PIXI from "./pixi"

class CustomButton extends PIXI.Sprite {
    constructor(text=null, name=null, width, height) {
        super();
        
        //  <name> parameter is for discerning 
        // the buttons in the click handler function.
        this.name = name;
        this.textStyle = this.generateStyle();

        const graphic = this.generateGraphic(width, height);
        const tag = this.generateText(text, this.textStyle);

        tag.anchor.set(0.5);
        tag.x = width/2;
        tag.y = height/2;
      
        
        this.addChild(graphic);
        this.addChild(tag);
        this.pivot.set(50,15);
        
    }

    generateStyle() {
        const style = new PIXI.TextStyle({
            align: "center",
            breakWords: true,
            fill: [
                "#f0e10f",
                "#fb8932"
            ],
            fontFamily: "Helvetica",
            fontSize: 15,
            fontVariant: "small-caps",
            fontWeight: "bold",
            lineJoin: "bevel",
            strokeThickness: 2,
            wordWrap: true,
            wordWrapWidth: 140
        });

        return style;
    }

    generateText(text, style) {
        return new PIXI.Text(text, style);
    }

    generateGraphic(width,height) {
        console.log(`generating @ ${width},${height}`)
        let graphic = new PIXI.Graphics();
        graphic.lineStyle(2,0xFFFFFF, 1);
        graphic.beginFill(0x000000);
        graphic.drawRoundedRect(0,0,width,height);
        return graphic;
    }
}