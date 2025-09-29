import type { AnimationSystem } from "../component/anim";
import { Expression } from "../component/expression";
import type { ExpressionConfig, ExpressionResult } from "./action";
import type { ActionConfig, ActionResult, ActionRunner } from "./actionmanager";
import { Container, Graphics, Text,Point } from 'pixi.js';

export class CreateExpression implements ActionRunner {
    run(input: ActionConfig): ExpressionResult {
        let config = input as ExpressionConfig;
        let output = {} as ExpressionResult;

        output.expression = new Expression(config.expression);
        output.expression.x = config.x;
        output.expression.y = config.y;
        config.stage.addChild(output.expression);
        output.index = config.index;
        return output
    }
}   
