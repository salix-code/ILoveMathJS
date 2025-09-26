
import { Container, Graphics, Text,Point } from 'pixi.js';
import { Arrow } from '../component/arrow';

type Rect = { x: number, y: number, w: number, h: number };

// 取交点。center为矩形中心，target为另一中心
function getRectLineIntersection(
    rect: Rect, center: Point, target: Point
): Point | null {
    // 首先算出矩形边界
    const minX = rect.x, minY = rect.y;
    const maxX = rect.x + rect.w, maxY = rect.y + rect.h;

    // 线的方向
    const dx = target.x - center.x;
    const dy = target.y - center.y;

    // t 值 where L(t) = center + t * (dx, dy)
    let tx1 = (minX - center.x) / dx;
    let tx2 = (maxX - center.x) / dx;
    let ty1 = (minY - center.y) / dy;
    let ty2 = (maxY - center.y) / dy;

    let txMin = Math.min(tx1, tx2);
    let txMax = Math.max(tx1, tx2);
    let tyMin = Math.min(ty1, ty2);
    let tyMax = Math.max(ty1, ty2);

    // 最早和最晚的交点
    let tEnter = Math.max(txMin, tyMin);
    let tExit  = Math.min(txMax, tyMax);

    // 我们找的是从中心沿着target方向，第一次离开边界的那个点，且 t > 0
    // tEnter < 0代表在中心内部才开始穿出，不考虑反方向
    if (tExit < tEnter || tExit < 0 || tEnter > 1) {
        return null; // 没有交点
    }

    // 如果中心在内部，tExit是出交点
    // 如果中心在外部（理论上不会），tEnter是入交点
    // 正常情况中心肯定在内部，选 tExit
    const t = tExit > 0 ? tExit : tEnter; //确保是从中心出发

    return {
        x: center.x + dx * t,
        y: center.y + dy * t
    };
}

export class Help {
    public static make_arrow(view:Container,x:number,y:number){
        const point:Point = view.getGlobalPosition();
        const bounds = view.getLocalBounds();
        const center = {
            'x' : point.x + bounds.x / 2,
            'y' : point.y + bounds.y / 2,
        };


        const rectA = { x: point.x, y: point.y, w: bounds.x, h: bounds.y };
        const rectB = { x: x, y: y, w: bounds.x, h: bounds.y };

        // 中心点
        const centerA = { x: rectA.x + rectA.w / 2, y: rectA.y + rectA.h / 2 };
        const centerB = { x: rectB.x + rectB.w / 2, y: rectB.y + rectB.h / 2 };

        // 相交点
        const pA = getRectLineIntersection(rectA, centerA, centerB);
        const pB = getRectLineIntersection(rectB, centerB, centerA);

        return new Arrow(pA.x,pA.y,pB.x,pB.y);
    }
}