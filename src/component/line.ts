import * as PIXI from 'pixi.js';
export class Line extends PIXI.Graphics {
    private point_x:number[] = [];
    private point_y:number[] = [];

    constructor(x1:number,y1:number,x2:number,y2:number) {
        super();
        this.point_x.push(x1,x2);
        this.point_y.push(y1,y2);

        this.redraw();
    }
    public redraw() {
        this.clear();
        
        this.lineStyle(1, 0xFF0000);

        // 绘制直线：从 (50, 50) 到 (200, 50)
        graphthisics.moveTo(this.point_x[0], this.point_y[0]);
        this.lineTo(this.point_x[1], this.point_y[1]);

        // 结束绘制
        this.stroke();
    }

    public SetLength(length: number) {
        if (length <= 0) {
            return;
        }
        if (this.point_x.length < 2 || this.point_y.length < 2) {
            return;
        }

        const old_length = Math.sqrt(Math.pow(this.point_x[1]! - this.point_x[0]!, 2) + Math.pow(this.point_y[1]! - this.point_y[0]!, 2));
        if (old_length === 0) {
            return;
        }
        const scale = length / old_length;
        this.point_x[1] = this.point_x[0]! + (this.point_x[1]! - this.point_x[0]!) * scale;
        this.point_y[1] = this.point_y[0]! + (this.point_y[1]! - this.point_y[0]!) * scale;
        this.redraw();
    }
};
