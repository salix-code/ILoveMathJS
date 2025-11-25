import * as PIXI from 'pixi.js';
import { BaseRender } from "./basesystem";

type RectItemDefinition = {
    x: number,
    y: number,
    w:number,
    h : number,
    color ? : string
}

class RectDefinition {
    private items: RectItemDefinition[] = [];
    private bRedraw : boolean = false;
    constructor() {
    }

    public NeedRedraw(){
        const v = this.bRedraw;
        this.bRedraw = false;
        return v;
    }

    public Array(): RectItemDefinition[] {
            return this.items;
        }
        public Get(idx:number) : RectItemDefinition | undefined{
            return this.items[idx];
        }
        public Last() : RectItemDefinition | undefined{
            return this.items[this.items.length - 1];
        }
        public Empty(){
            this.items.splice(0,this.items.length);
            this.bRedraw = true;
        }
        public Add(item: RectItemDefinition) {
            this.bRedraw = true;
            this.items.push(item);
        }
        public RemoveAt(index : number,count : number = 1){
            this.bRedraw = true;
            this.items.splice(index,count);
        }
        public Apply(index:number, func : (i:RectItemDefinition)=>void){
            let item = this.items[index];
            if(item){
                this.bRedraw = true;
                func(item);
            }
        }
}

class RectSystem extends BaseRender {
    private m_data: RectDefinition;
    constructor(data: RectDefinition, container: PIXI.Container, x: number = 0, y: number = 0, tag?: string) {
        super(container, x, y);
        this.m_data = data;
    }
    public redraw(): void {
        if(!this.m_data.NeedRedraw()){
            return;
        }
        this.m_graphics.clear();

        for (let item of this.m_data.Array()) {
            const color = item.color ?? "black";
            this.m_graphics.rect(item.x,item.y,item.w,item.h).fill({color:color});
        }
        this.m_graphics.stroke();

    }
}

export { RectDefinition, RectSystem }