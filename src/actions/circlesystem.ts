import * as PIXI from 'pixi.js';

export type CircleItemDefinition = {
    x: number,
    y: number,
    r: number,
    fill: boolean,
    color?: string,
}

export class CircleDefinition {
    private items: CircleItemDefinition[]
    constructor() {
        this.items = [];
    }
    public Add(item: CircleItemDefinition) {
        this.items.push(item);
    }
    public RemoveAt(index: number) {
        this.items.splice(index, 1);
    }
    public RemoveLength(index: number, length: number) {
        this.items.splice(index, length);
    }
    public Array() {
        return this.items;
    }
    public Empty() {
        this.items.splice(0, this.items.length);
    }
    public Get(index:number) : CircleItemDefinition | undefined {
        return this.items[index];
    }
}


export class CircleRender {
    private m_data: CircleDefinition;
    private m_graphics: PIXI.Graphics;
    constructor(data: CircleDefinition, graphics: PIXI.Graphics) {
        this.m_data = data;
        this.m_graphics = graphics;
    }
    public redraw() {
        this.m_graphics.clear();
        for (let item of this.m_data.Array()) {
            const color = item.color ? item.color : 'white';
            if (item.fill) {
                this.m_graphics.circle(item.x, item.y, item.r).fill({ color: color }).stroke({ width: 1 })
            } else {
                this.m_graphics.circle(item.x, item.y, item.r).stroke({ color: color, width: 1 })
            }

        }
    }
}