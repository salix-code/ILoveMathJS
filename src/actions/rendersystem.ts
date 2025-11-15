import * as PIXI from 'pixi.js';

export type SegmentRenderItem = {
    lines: { x1: number, y1: number, x2: number, y2: number, color: string }[],
    dashs: { x: number, y: number }[]
}
export class SegmentRender {
    private m_renderItem: SegmentRenderItem | null = null;
    private m_graphics: PIXI.Graphics | null = null;
    constructor(graphics : PIXI.Graphics,segmetItem : SegmentRenderItem) {
        this.m_graphics = graphics;
        this.m_renderItem = segmetItem;
    }

    public redraw() {
        if (this.m_renderItem == null) {
            return;
        }
        if (this.m_graphics == null) {
            return;
        }

        for (let line of this.m_renderItem.lines) {
            const color = line.color ?? "white";
            this.m_graphics.moveTo(line.x1, line.y1).lineTo(line.x2, line.y2).stroke({ color: color, width: 1 });
        }
        for (let dash of this.m_renderItem.dashs) {
            this.m_graphics.circle(dash.x, dash.y, 4).fill("white")
        }

    }

}

export type RectItemDefinition = {
    x : number,
    y : number,
    w : number,
    h : number,
    color ?: string,
}

export class RectDefinition {
    private items : RectItemDefinition[]
    constructor(){
        this.items = [];
    }
    public Add(item : RectItemDefinition) {
        this.items.push(item);
    }
    public RemoveAt(index : number){
        this.items.splice(index,1);
    }
    public Array(){
        return this.items;
    }
    public Empty(){
        this.items.splice(0,this.items.length);
    }
}

export class RectRender {
    private m_data : RectDefinition;
    private m_graphics : PIXI.Graphics;
    constructor(data:RectDefinition,graphics : PIXI.Graphics){
        this.m_data = data;
        this.m_graphics = graphics;
    }
    public redraw(){
        this.m_graphics.clear();
        for(let item of this.m_data.Array()){
            this.m_graphics.rect(item.x,item.y,item.w,item.h).stroke({color:'white',width : 1})
        }
    }
}

export type TextRenderItem ={
    text : string,
    x : number,
    y: number,
    color? : string,
    fontsize? : number,
}

export class TextRender {
    private m_container: PIXI.Container | null = null;
    private m_textItem : TextRenderItem[] | null = null
    private m_textPool : PIXI.Text[] = [];
    private m_fontSize ? :number = 0;
    constructor(contaier : PIXI.Container,text_item : TextRenderItem[]) {
        this.m_container = contaier;
        this.m_textItem = text_item;
    }
    public redraw(){
        if(this.m_container == null){
            return;
        }
        if(this.m_textItem == null){
            return;
        }
        this.m_container.removeChildren();

        let textWidgetIndex = 0;
        for(let i = 0; i < this.m_textItem.length ; ++i){
            let item = this.m_textItem[i];
            if(!item){
                continue;
            }
            let widget : PIXI.Text | undefined;
            if(textWidgetIndex >=0 && textWidgetIndex < this.m_textPool.length){
                widget = this.m_textPool[textWidgetIndex];
            }
            if(!widget){
                widget = new PIXI.Text();
                this.m_textPool.push(widget);
            }
            widget.text = item.text;
            widget.x = item.x;
            widget.y = item.y;
            widget.style.fill = item.color ?? "white";
            widget.style.fontSize = item.fontsize ?? 24;
            this.m_container.addChild(widget);
            textWidgetIndex += 1;

        }

        if(textWidgetIndex < this.m_textPool.length){
            this.m_textPool.splice(textWidgetIndex,this.m_textPool.length - textWidgetIndex - 1);
        }
    }
}

