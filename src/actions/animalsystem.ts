import * as PIXI from 'pixi.js';
import { BaseRender } from './basesystem';

export type AnimalItemDefinition = {
    x: number,
    y: number,
    r: number,
    foot: number,
    color?: string,
}

class AnimalDefinition {
    private items: AnimalItemDefinition[] = [];
    private bRedraw: boolean = false;
    constructor() {

    }

    public Array(): AnimalItemDefinition[] {
        return this.items;
    }
    public Get(idx: number): AnimalItemDefinition | undefined {
        return this.items[idx];
    }
    public Num(): number {
        return this.items.length;
    }
    public Last(): AnimalItemDefinition | undefined {
        return this.items[this.items.length - 1];
    }
    public Empty() {
        this.items.splice(0, this.items.length);
        this.bRedraw = true;
    }
    public Add(item: AnimalItemDefinition) {
        this.bRedraw = true;
        this.items.push(item);
    }
    public RemoveAt(index: number, count: number = 1) {
        this.bRedraw = true;
        this.items.splice(index, count);
    }
    public Apply(index: number, func: (i: AnimalItemDefinition) => void) {
        let item = this.items[index];
        if (item) {
            this.bRedraw = true;
            func(item);
        }
    }
    public ForEach(beginIdx: number, endIdx: number, func: (item: AnimalItemDefinition, idx: number) => void) {
        for (let i = beginIdx; i < endIdx && i < this.items.length; ++i) {
            func(this.items[i]!, i)
        }
        this.bRedraw = true;
    }
    public FindFootPosition(idx: number, foot: number): [number, number] {
        const item = this.items[idx];
        if (item) {
            const width = 16 * 2 + 8 * (2 - 1);
            const x = [item.x - width / 2, item.x - width / 2 + 24];

            const xIdx = foot % 2;

            const yIdx= Math.floor(foot / 2 + 1) * 40 + item.y;
            
            return [x[xIdx]!,yIdx]

        }
        return [0, 0];
    }
    public CalcWidth(footNum: number): number {
        return 16 * footNum + 8 * (footNum - 1);
    }
    public NeedRedraw() {
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
        if (!this.m_data.NeedRedraw()) {
            return;
        }
        this.m_graphics.clear();

        for (let item of this.m_data.Array()) {
            if(item.foot == 0){
                continue;
            }
            const color = item.color ?? "white";
            const width = 16 * 2 + 8 * (2 - 1);
            const x = [item.x - width / 2, item.x - width / 2 + 24];
            let y = item.y + 40;
            let footIdx = 0;
            this.m_graphics.rect(x[0]!, y, 16, 16).fill({ color: color });
            this.m_graphics.rect(x[1]!, y, 16, 16).fill({ color: color });
            this.m_graphics.moveTo(x[0]! + 8, y).lineTo(item.x, item.y).lineTo(x[1]!+8,y).stroke({ color: "white" })
            footIdx += 2;
            y += 40;
            let count = 0;
            while(footIdx < item.foot){
                const xIdx = footIdx % 2;
                this.m_graphics.rect(x[xIdx]!, y, 16, 16).fill({ color: color });
                this.m_graphics.moveTo(x[xIdx]! + 8, y).lineTo(x[xIdx]!+8,y - 24).stroke({ color: "white" });
                count += 1;
                if(count == 2){
                    y += 40;
                    count = 0;
                }
                footIdx += 1;
            }
        }
        this.m_graphics.stroke();

    }
}

export { AnimalDefinition, AnimalSystem }