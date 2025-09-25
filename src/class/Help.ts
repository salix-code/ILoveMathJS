
import { Container, Graphics, Text,Point } from 'pixi.js';
import { Arrow } from '../component/arrow';

export class Help {
    public static make_arrow(view:Container,x:number,y:number){
        const point:Point = view.getGlobalPosition();
        const bounds = view.getLocalBounds();
        const arrow = new Arrow(x, y, x, y);

        return arrow;
    }
}