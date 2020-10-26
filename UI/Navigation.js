import Element from './UI_Element.js';
import {POKEMON_NUMBER, POKEMON_PER_PAGE} from '../util/Constants.js';
export default class Navigation extends PIXI.Container{
    constructor() {
        super();

        // export const POKEMON_NUMBER = 893;
        // export const POKEMON_PER_PAGE = 8;

        let elem_width = 100;
        let elem_height = 30;

        this.width = 600;
        this.height = 120;

        this.buttonPrev = this._createElement_(elem_width, elem_height, "<< PREV <<", 'prev', false);
        this.buttonPick = this._createElement_(elem_width, elem_height, "** PICK **", 'pick', false);
        this.buttonNext = this._createElement_(elem_width, elem_height, ">> NEXT >>", 'next');
        this.page = this._createElement_(elem_width, elem_height, "0 / 0", 'page', true, false, false);
        this.all = [this.buttonPrev, this.buttonPick, this.buttonNext, this.page];
        
        this.page.max = Math.ceil(POKEMON_NUMBER / POKEMON_PER_PAGE);
        this._updatePage_(1);
        
        this.buttonPrev.on('pointerdown', this._navigate_);
        this.buttonNext.on('pointerdown', this._navigate_);

        let i=0;
        this.all.forEach(navElement => {
            let stageWidth = 600;
            let padding = 175;
            navElement.x = padding+ i*( (stageWidth-100) / this.all.length );
            navElement.y = 475;
            this.addChild(navElement);
            i++;
        })
    }

    toggleButtons(state){
        [this.buttonPrev, this.buttonPick, this.buttonNext].forEach(button  => {
            button.interactive = state;
            button.alpha = state? 1:0.5;
        });
    }

    changeVisible(elementName, state) {
        this.all.forEach(element => {
            if(element.name === elementName && element.visible != state)
            element.visible = state;
        })
    }

    _updatePage_(newPage){
        if(newPage <= 0) newPage = 1;
        this.page.cur = newPage;
        this.page.text_tag.text = `${this.page.cur} / ${this.page.max}`;
    }
    
    _navigate_({target}) {
        let nav = this.parent
        if(target.name === 'prev') nav._updatePage_(nav.page.cur - 1);
        if(target.name === 'next') nav._updatePage_(nav.page.cur + 1);
        if(nav.page.cur === 1) nav.changeVisible('prev', false);
        else nav.changeVisible('prev', true);
        if(nav.page.cur === nav.page.max) nav.changeVisible('next', false);
        else nav.changeVisible('next', true);
    }

    _createElement_(width, height, text, name, initiallyVisible=true, border=true, isButton=true) {
        let element = new Element(width, height, text, border);
        element.pivot.set(width/2, height/2);
        element.visible = initiallyVisible;
        element.interactive = isButton;
        element.buttonMode = isButton;
        element.name = name;

        return element;
    }
}