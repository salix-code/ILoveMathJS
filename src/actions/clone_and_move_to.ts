import type { AnimationSystem } from "../component/anim";
import type { CloneAndMoveToConfig, CloneAndMoveToResult } from "./action";
import type { ActionConfig, ActionResult, ActionRunner } from "./actionmanager";
import { Container, Graphics, Text,Point } from 'pixi.js';

export class CloneAndMoveToRunner implements ActionRunner {
    run(input: ActionConfig): ActionResult {
        let config = input as CloneAndMoveToConfig;
        let result = {} as CloneAndMoveToResult;

        result.anim_label = new Text();
        result.anim_label.style = config.label.style;
        result.anim_label.text = config.label.text;
        let position:Point = config.label.getGlobalPosition();
    
        result.anim_label.position = config.stage.toLocal(position,config.stage);
        config.stage.addChild(result.anim_label);
        
        config.animation_system.move_to(result.anim_label,config.target_x,config.target_y,2);

        

        return result
    }
}   
