import * as PIXI from 'pixi.js';
import type { Vector4 } from '../maths/vector';

export interface ArrowOptions {
    color?: number;
    width?: number;
    headLength?: number;
    headAngle?: number;
}

// anchors
export type ArrowInitializer = {
    start_point : {
        point : Vector4,
        size : PIXI.ISize,
    }
    end_point : {
        point : Vector4,
        size : PIXI.ISize,
    }
    option?:ArrowOptions
}

export class Arrow extends PIXI.Graphics {
    
    private m_initializer! : ArrowInitializer;

    constructor(initializer : ArrowInitializer) {
        super();
        this.m_initializer = initializer;
        this.redraw();
    }
    
    // 重新绘制
    public redraw() {
        this.clear();

        const {
            option = {
                color : 0xFFFFFF,
                width : 2,
                headLength : 8,
                headAngle : Math.PI / 7
            }
        } = this.m_initializer;

        let coordination = this.m_initializer.start_point;
        const x1 = coordination.point.x + coordination.point.z * coordination.size.width;
        const y1 = coordination.point.y + coordination.point.w * coordination.size.height;

        coordination = this.m_initializer.start_point;
        const x2 = coordination.point.x + coordination.point.z * coordination.size.width;
        const y2 = coordination.point.y + coordination.point.w * coordination.size.height;

        // 主线体
        this.lineStyle(option.width, option.color);
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