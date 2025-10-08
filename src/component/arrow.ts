import * as PIXI from 'pixi.js';

export interface ArrowOptions {
    color?: number;
    width?: number;
    headLength?: number;
    headAngle?: number;
}

export class Arrow extends PIXI.Graphics {
    private start: PIXI.Point;
    private end: PIXI.Point;
    private options: ArrowOptions;

    constructor(
        x1: number, y1: number, x2: number, y2: number,
        options: ArrowOptions = {}
    ) {
        super();
        this.start = new PIXI.Point(x1, y1);
        this.end = new PIXI.Point(x2, y2);
        this.options = options;
        this.redraw();
    }

    // 更新起点和终点
    public setFrom(x: number, y: number) {
        this.start.set(x, y);
        this.redraw();
    }

    public setTo(x: number, y: number) {
        this.end.set(x, y);
        this.redraw();
    }

    // 动态设置参数
    public setOptions(options: ArrowOptions) {
        Object.assign(this.options, options);
        this.redraw();
    }

    // 重新绘制
    public redraw() {
        this.clear();

        const {
            color = 0xFFFFFF,
            width = 2,
            headLength = 8,
            headAngle = Math.PI / 7
        } = this.options;

        const x1 = this.start.x, y1 = this.start.y, x2 = this.end.x, y2 = this.end.y;
        // 主线体
        this.lineStyle(width, color);
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        
        // 箭头角度
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const a1 = angle + headAngle;
        const a2 = angle - headAngle;

        // 箭头头/三角形，填充
        this.beginFill(color);
        this.moveTo(x2, y2);
        this.lineTo(x2 - headLength * Math.cos(a1), y2 - headLength * Math.sin(a1));
        this.lineTo(x2 - headLength * Math.cos(a2), y2 - headLength * Math.sin(a2));
        this.lineTo(x2, y2);
        this.endFill();
    }
}