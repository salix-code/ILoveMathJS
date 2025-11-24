import * as PIXI from 'pixi.js';
import { BaseRender } from './basesystem';


export type SegmentDefinition = {
    points: { x: number, y: number, color?: string, dash?: boolean, alpha?: number }[],
    color?: string
}

export class SegmentData {
    protected items: SegmentDefinition[] = []
    protected bNeedRedraw: boolean = false;
    constructor() {

    }
    public Add(segment: SegmentDefinition): number {
        this.items.push(segment)
        this.bNeedRedraw = true;
        return this.items.length - 1
    }
    public Get(index: number) {
        return this.items[index];
    }
    public Array() {
        return this.items;
    }
    public RemoveAt(index: number) {
        this.bNeedRedraw = true;
        this.items.splice(index, 1);
    }
    public Empty() {
        this.bNeedRedraw = true;
        this.items.splice(0, this.items.length);
    }


    public Apply(index: number, func: (item: SegmentDefinition) => void) {
        const item = this.Get(index);
        if (item) {
            func(item);
            this.bNeedRedraw = true;
        }
    }
    public NeedRedraw(): boolean {
        const ret = this.bNeedRedraw;
        this.bNeedRedraw = false;
        return ret
    }
}



export class SegmentRender extends BaseRender {
    private m_data: SegmentData | null = null;

    constructor(segmetItem: SegmentData, container: PIXI.Container, x: number = 0, y: number = 0) {
        super(container, x, y);
        this.m_data = segmetItem;
    }

    public redraw() {
        if (this.m_data == null) {
            return;
        }
        if (this.m_graphics == null) {
            return;
        }
        if (!this.m_data.NeedRedraw()) {
            return;
        }
        this.m_graphics.clear();

        const array = this.m_data.Array();
        if (array.length < 2) {
            return
        }

        for (const segment of this.m_data.Array()) {
            const points = segment.points;
            if (points.length < 2) {
                continue;
            }
            let point = points[0]!;

            const dashs: { x: number, y: number, color: string, alpha: number }[] = []
            if (point.dash) {
                dashs.push({ x: point.x, y: point.y, color: point.color ?? "white", alpha: point.alpha ?? 1 });
            }
            this.m_graphics.moveTo(point.x, point.y);
            let color = point.color ?? segment.color ?? "white";
            let alpha = point.alpha ?? 1;
            for (let i = 1; i < points.length; ++i) {
                if (points[i] === undefined) {
                    continue;
                }
                this.m_graphics.lineTo(points[i]!.x, points[i]!.y).stroke({ color: color, width: 1, alpha: alpha });
                if (points[i]!.dash) {
                    dashs.push({ x: points[i]!.x, y: points[i]!.y, color: color, alpha: alpha });
                }
                color = points[i]!.color ?? segment.color ?? "white";
                alpha = points[i]!.alpha ?? 1;
            }
            for (let dash of dashs) {
                this.m_graphics.circle(dash.x, dash.y, 4).fill(dash.color).stroke({ alpha: dash.alpha });
            }
        }

    }

}

export type RectItemDefinition = {
    x: number,
    y: number,
    w: number,
    h: number,
    color?: string,
}

export class RectDefinition {
    private items: RectItemDefinition[]
    constructor() {
        this.items = [];
    }
    public Add(item: RectItemDefinition) {
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
}

export class RectRender {
    private m_data: RectDefinition;
    private m_graphics: PIXI.Graphics;
    constructor(data: RectDefinition, graphics: PIXI.Graphics) {
        this.m_data = data;
        this.m_graphics = graphics;
    }
    public redraw() {
        this.m_graphics.clear();
        for (let item of this.m_data.Array()) {
            this.m_graphics.rect(item.x, item.y, item.w, item.h).stroke({ color: 'white', width: 1 })
        }
    }
}

export type TextRenderItem = {
    text: string,
    x: number,
    y: number,
    color?: string,
    fontsize?: number,
}

export class TextRender {
    private m_container: PIXI.Container | null = null;
    private m_textItem: TextRenderItem[] | null = null
    private m_textPool: PIXI.Text[] = [];
    private m_fontSize?: number = 0;
    constructor(contaier: PIXI.Container, text_item: TextRenderItem[]) {
        this.m_container = contaier;
        this.m_textItem = text_item;
    }
    public redraw() {
        if (this.m_container == null) {
            return;
        }
        if (this.m_textItem == null) {
            return;
        }
        this.m_container.removeChildren();

        let textWidgetIndex = 0;
        for (let i = 0; i < this.m_textItem.length; ++i) {
            let item = this.m_textItem[i];
            if (!item) {
                continue;
            }
            let widget: PIXI.Text | undefined;
            if (textWidgetIndex >= 0 && textWidgetIndex < this.m_textPool.length) {
                widget = this.m_textPool[textWidgetIndex];
            }
            if (!widget) {
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

        if (textWidgetIndex < this.m_textPool.length) {
            this.m_textPool.splice(textWidgetIndex, this.m_textPool.length - textWidgetIndex - 1);
        }
    }
}

