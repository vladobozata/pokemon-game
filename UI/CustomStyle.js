export default class CustomStyle {
    static getStyle(fontSize=15) {
        const style = new PIXI.TextStyle({
            align: "center",
            breakWords: true,
            fill: [
                "#f0e10f",
                "#fb8932"
            ],
            fontFamily: "Helvetica",
            fontSize: fontSize,
            fontVariant: "small-caps",
            fontWeight: "bold",
            lineJoin: "bevel",
            strokeThickness: 2,
            // wordWrap: true,
            // wordWrapWidth: 140
        });

        return style;
    }
}