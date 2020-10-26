import CustomStyle from './CustomStyle.js';
export default class HealthBar extends PIXI.Sprite {
    constructor(name){
        super();
        
        // let style = new CustomButton().textStyle;
        let style = CustomStyle.getStyle();
        let tag = new PIXI.Text(name, style);
        tag.anchor.set(0.5);
        tag.x = 196/2;
        tag.y = 26/2;

        this.background = this.create_background();
        this.foreground = this.create_foreground(1);

        
        
        this.addChild(this.background);
        this.background.addChild(this.foreground);
        this.background.addChild(tag);

    }

    

    create_background() {
        let bg = new PIXI.Graphics();
        bg.beginFill(0xFFFFFF, 1);
        bg.drawRoundedRect(0,0,200,30);
        
        return bg;
    }

    create_foreground(percentHealth) {
        let full = 196;
        let current = full*percentHealth;
        let fg = new PIXI.Graphics();
        fg.beginFill(0x22DD22, 1);
        fg.drawRoundedRect(2,2,current,26);
        
        
        return fg;

    }

    update_foreground(percentHealth){
        let fullWidth = 196;
        let currentWidth = fullWidth*percentHealth;
        if(currentWidth<0) currentWidth = 0;
        
        gsap.to(this.foreground, {width:currentWidth, duration:1.0});
    }
}