import * as PIXI from 'pixi.js';
import { BaseRender } from './basesystem';

export type CurlyItemDefinition = {
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    height: number,
    text?: string,
    color?: string,
    textColor?: string,
    textOffset?: [number, number]
}

export class CurlyDefinition {
    private items: CurlyItemDefinition[];
    constructor() {
        this.items = [];
    }
    public Add(item: CurlyItemDefinition) {
        this.items.push(item);
    }
    public RemoveAt(index: number) {
        this.items.splice(index, 1);
    }
    public Array() {
        return this.items;
    }
    public Empty() {
        this.items.splice(0, this.items.length);
    }
    public Get(index: number): CurlyItemDefinition | undefined {
        return this.items[index];
    }
}


export class CurlyRender extends BaseRender{
    private m_data: CurlyDefinition;
    
    constructor(data: CurlyDefinition, container: PIXI.Container,x : number=0,y:number=0) {
        super(container, x, y);
        this.m_data = data;
        
    }
    
    public redraw() {
        this.m_graphics.clear();
        this.m_textIndex = 0;
        this.m_graphics.removeChildren();
        
        const items = this.m_data.Array();
        for (let curly of items) {

            if (curly.y1 == curly.y2) {
                const halfWidth = (curly.x2 - curly.x1) / 2;
                const xOffset = Math.abs(curly.height) * 0.6;
                const color = curly.color ?? "yellow"
                this.m_graphics.moveTo(curly.x1, curly.y1)
                    .lineTo(curly.x1 + xOffset, curly.y1 - curly.height)
                    .lineTo(curly.x1 + halfWidth - xOffset, curly.y1 - curly.height)
                    .lineTo(curly.x1 + halfWidth, curly.y1 - curly.height * 2)
                    .lineTo(curly.x1 + halfWidth + xOffset, curly.y1 - curly.height)
                    .lineTo(curly.x2 - xOffset, curly.y1 - curly.height)
                    .lineTo(curly.x2, curly.y2)
                    .stroke({ width: 1, color: color });

                if (curly.text) {
                    const fontSize = 16;
                    const textColor = curly.textColor ?? "white";
                    const style = new PIXI.TextStyle({ fill: textColor, fontSize: fontSize });
                    const metrics = PIXI.CanvasTextMetrics.measureText(curly.text, style);

                    const text = this.get_text_from_pool();
                    text.text = curly.text;
                    text.style = style
                    text.x = curly.x1 + halfWidth - metrics.width / 2
                    text.y = curly.y1 - curly.height * 2;
                    if (curly.height > 0) {
                        text.y -= 20;
                    }
                    else {
                        text.y += 10
                    }
                }
            }

        }
    }
}
