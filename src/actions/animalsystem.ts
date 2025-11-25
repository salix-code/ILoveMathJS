import * as PIXI from 'pixi.js';
import { BaseRender } from './basesystem';

export type AnimalItemDefinition = {
    x: number,
    y: number,
    r: number,
    foot: number,
    color ?: string,
}

class AnimalDefinition {
    private items: AnimalItemDefinition[] = [];
    private bRedraw : boolean = false;
    constructor() {

    }

    public Array(): AnimalItemDefinition[] {
        return this.items;
    }
    public Get(idx:number) : AnimalItemDefinition | undefined{
        return this.items[idx];
    }
    public Last() : AnimalItemDefinition | undefined{
        return this.items[this.items.length - 1];
    }
    public Empty(){
        this.items.splice(0,this.items.length);
        this.bRedraw = true;
    }
    public Add(item: AnimalItemDefinition) {
        this.bRedraw = true;
        this.items.push(item);
    }
    public RemoveAt(index : number,count : number = 1){
        this.bRedraw = true;
        this.items.splice(index,count);
    }
    public Apply(index:number, func : (i:AnimalItemDefinition)=>void){
        let item = this.items[index];
        if(item){
            this.bRedraw = true;
            func(item);
        }
    }
    public FindFootPosition(idx:number,foot : number) : [number,number]{
        const item = this.items[idx];
        if(item){
            const width = 16 * item.foot + 8 * (item.foot - 1);
            let x = item.x - width / 2;

            return [x + foot * 24,item.y + 40];
        }
        return [0,0];
    }
    public NeedRedraw(){
        const v = this.bRedraw;
        this.bRedraw = false;
        return v;
    }

}

function degreesToRadius(degrees: number) {
    return degrees * (Math.PI / 180);
}


class AnimalSystem extends BaseRender {
    private m_data: AnimalDefinition;
    constructor(data: AnimalDefinition, container: PIXI.Container, x: number = 0, y: number = 0, tag?: string) {
        super(container, x, y);
        this.m_data = data;
    }
    public redraw(): void {
        if(!this.m_data.NeedRedraw()){
            return;
        }
        this.m_graphics.clear();

        for (let item of this.m_data.Array()) {
            const color = item.color ?? "white";
            const width = 16 * item.foot + 8 * (item.foot - 1);
            let x = item.x - width / 2;
            const y = item.y + 40;
            for(let i = 0; i < item.foot; ++i){
                this.m_graphics.rect(x,item.y + 40,16,16).fill({color:color});
                this.m_graphics.moveTo(x + 8,item.y + 40).lineTo(item.x,item.y).stroke({color:color})
                x += 24;
            }
            
            //this.m_graphics.rect(item.x + width / 2,item.y + 40,16,16);
            //this.m_graphics.circle(item.x, item.y, item.r)
            
            //let degress = 20;
            //let radius = degreesToRadius(degress);
            //let num = Math.floor(item.foot / 2);
            // for (let i = 0; i < num; ++i) {
            //     const sLen = item.r ;
            //     const eLen = item.r * 2.4;
            //     this.m_graphics.moveTo(item.x + sLen * Math.sin(radius), item.y + sLen * Math.cos(radius))
            //         .lineTo(item.x + eLen * Math.sin(radius), item.y + eLen * Math.cos(radius));
            //     this.m_graphics.moveTo(item.x - sLen * Math.sin(radius), item.y + sLen * Math.cos(radius))
            //         .lineTo(item.x - eLen * Math.sin(radius), item.y + eLen * Math.cos(radius));

            //     degress += 20;
            //     radius = degreesToRadius(degress);
            // }
            // this.m_graphics.stroke({color:color});
        }
        this.m_graphics.stroke();

    }
}

export { AnimalDefinition, AnimalSystem }