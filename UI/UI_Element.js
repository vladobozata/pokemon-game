import style from "./CustomStyle.js"
export default class UI_Element extends PIXI.Sprite {
    constructor(width, height, text="", border, fontSize=15) {
        super();

        // this.width = width;
        // this.height = height;
        this.graphic = this._drawGraphic_(width, height, border);
        this.text_style = style.getStyle(fontSize);
        if(text) this.text_tag = this._drawText_(text, width, height);
        
    }

    _drawGraphic_(width, height, border) {
        let graphic = new PIXI.Graphics();
        
        if(border)
        graphic.lineStyle(1.5,0xCCAA55, 1);
        graphic.beginFill(0x000000);
        graphic.drawRoundedRect(0,0,width,height);

        this.addChild(graphic);
        return graphic;
    }
    _drawText_(text, width, height) {
        let tag = new PIXI.Text(text, this.text_style);
        tag.anchor.set(0.5);
        tag.x = width / 2;
        tag.y = height / 2;

        this.addChild(tag)
        return tag;
    }
    
}
