import * as PIXI from 'pixi.js';

export class BaseRender {
    protected m_container: PIXI.Container;
    protected m_graphics: PIXI.Graphics;
    protected m_textPool: PIXI.Text[] = [];
    protected m_textIndex: number = 0;

    constructor(container: PIXI.Container, x: number = 0, y: number = 0) {
        this.m_container = container;
        this.m_graphics = new PIXI.Graphics();
        this.m_graphics.x = x;
        this.m_graphics.y = y;
        this.m_graphics.label = "dontclean";
        this.m_container.addChild(this.m_graphics);
    }

    protected get_text_from_pool(): PIXI.Text {
        let text: PIXI.Text | null = null;
        if (this.m_textIndex >= 0 && this.m_textIndex < this.m_textPool.length) {
            text = this.m_textPool[this.m_textIndex]!
            if(text.parent == null){
                this.m_graphics.addChild(text);
            }
        }
        else {
            text = new PIXI.Text();
            this.m_graphics.addChild(text);
            this.m_textPool.push(text);
        }
        this.m_textIndex += 1;
        return text!;
    }
}