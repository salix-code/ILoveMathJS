import { Container, Graphics, Text,Point } from 'pixi.js';
import type { ActionConfig, ActionResult } from './actionmanager';
import type { AnimationSystem } from '../component/anim';

export interface CloneAndMoveToConfig extends ActionConfig{
    stage:Container,
    label:Text,
    animation_system : AnimationSystem,
    target_x: number,
    target_y : number,
}

export interface CloneAndMoveToResult extends ActionResult {
    anim_label :Text,
}


export interface ExpressionConfig extends ActionConfig {
    stage:Container,
    expression:string,
    x:number,
    y:number,
    index:number,
}

export interface ExpressionResult extends ActionResult {
    expression :Container,
    index : number
}