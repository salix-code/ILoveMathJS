import { Container, Graphics, Text,Point } from 'pixi.js';
import { Expression } from "../component/expression";

import type {ISystem,IComponent, IComponentData} from "./system";


export interface ExpressionConfig extends IComponent{
    expression : string;
}

export class ExpressionSystem implements ISystem{
    private m_View:Container ;
    private m_expression: Map<number,Container> = new Map();
    constructor(view:Container){
        this.m_View = view;
    }
    
    update(component:IComponentData,delta : number){
        let config = component.config as ExpressionConfig;

        const expression = new Expression(config.expression);
        expression.x = 300;
        expression.y = 200;
        this.m_View.addChild(expression);
        this.m_expression.set(0,expression);
    }
    remove(index: number): void {
        
    }

    filter(tag:string):boolean{
        return tag === "ExpressionConfig"
    }
};