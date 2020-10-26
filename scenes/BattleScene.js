import HealthBar from '../UI/HealthBar.js';

export default class BattleScene extends PIXI.Container {
    constructor(){
        super();

        this.battleMusic = PIXI.sound.Sound.from({
            url: './assets/battle.mp3',
            volume: 0.2,
        });
        this.hitSound = PIXI.sound.Sound.from('../assets/hit.wav');

        this.playerPokemon;
        this.opponentPokemon;
        this.endScenario;
    }

    start(player, opponent){
        this.battleMusic.play();
        this._prepareCombatants_(player, opponent);
        this.visible = true;

        this.addChild(this._loadBattleBackground_());
        this.addChild(this.opponentPokemon.bar);
        this.addChild(this.playerPokemon.bar);
        this.addChild(this.opponentPokemon);
        this.addChild(this.playerPokemon);
        return this.beginFight();
    }

    stop() {
        this.visible = false;
        this.removeChildren();
        this.battleMusic.stop();
    }

    _pause_(time = 3000) {
        const pauseTime = new Promise(function(resolve){
            setTimeout( resolve, time);
        });
        return pauseTime;
    }

    async beginFight() {
        await this._pause_();
        const player = this.playerPokemon;
        const opponent = this.opponentPokemon;
        let turn = player.stats['speed'] > opponent.stats['speed']? 'player':'opponent';

        while(true){
            if (player.currentHP<= 0) {
                this.endScenario = 'lost';
                break;
            } else if (opponent.currentHP <= 0) {
                this.endScenario = 'won';
                break;
            }
    
            if(turn === 'player') await this._doTurn_(player, opponent, 'player');
            if(turn === 'opponent') await this._doTurn_(opponent, player, 'opponent');
            turn = turn==='player'? 'opponent':'player';
        }
        
        await this._pause_();
        
    }
    
    async _doTurn_(attacker, defender, attackerName){
        const modifiers = attackerName==='player'? [-25,+25]:[+50,-50];
        const attack_pos_x = defender.x + modifiers[0];
        const attack_pos_y = defender.y + modifiers[1];

        let attackerX = attacker.x, 
        attackerY = attacker.y, 
        attackerScale = attacker.scale.x;

        let defenderScale = defender.scale.x,
        defenderBar = defender.bar;


        let damage = this._calculateDamage_(attacker, defender);
        if(damage > 0){
            let newHealth = this._dealDamage_(defender,damage);
            gsap.to(attacker, {x: attack_pos_x, y: attack_pos_y, duration:0.5});
            await gsap.to(attacker.scale, {x: defenderScale, y: defenderScale, duration:0.5});
            defenderBar.update_foreground(newHealth);
            this.hitSound.play();
            await gsap.to(defender, {alpha:0.2, duration:.1, repeat:5, yoyo:true})
            gsap.to(attacker.scale, {x: attackerScale, y: attackerScale, duration:0.5});
            await gsap.to(attacker, {x:attackerX, y:attackerY, duration:0.5});
        };
    }
    _calculateDamage_(attacker, defender){
        const DAMAGE_MODIFIER = 200;
        const damage =      (attacker.stats.attack/defender.stats.defense)*
                            Math.floor( Math.random() * DAMAGE_MODIFIER );
        return damage;
    }

    _dealDamage_(defender, damage){
        defender.currentHP -= damage;
        let percentHealth = defender.currentHP/defender.stats.hp;

        return percentHealth;
    }

    _prepareCombatants_(player, opponent) {
        // Prepare player character
        player.texture = player.textures.back;
        player.scale.set(1.25);
        player.position.set(55, 335);
        player.bar = new HealthBar(player.name);
        player.bar.position.set(15, 450);
    
        // Prepare opponent character
        opponent.position.set(450,200);
        opponent.scale.set(0.75);
        opponent.bar = new HealthBar(opponent.name);
        opponent.bar.position.set(385, 15);

        this.playerPokemon = player;
        this.opponentPokemon = opponent;
    }

    _loadBattleBackground_(){
        let local = '../assets/battleBackground.png';
        let texture = new PIXI.Texture.from(local);

        let background = new PIXI.Sprite(texture);
        background.height = 500;
        background.width = 600;

        return background;
    }

}