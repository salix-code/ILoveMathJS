import { Container, Graphics, Text,Point } from 'pixi.js';
import {QuestionView,QuestionController} from "../class/Question"
import { Expression } from '../component/expression';
import type { ISystem } from '../system/system';
import { ExpressionSystem ,type ExpressionConfig} from '../system/expressionsystem';

class Question_1 extends QuestionView{
    private expression:Expression[] = [];
    
    constructor(title:string) {
        super(title);
        this.draw_answer_function = [
            
        ]
        this.add_system(new ExpressionSystem(this));
        this.init_view();
    }
    public regenerate(): void {
        this.clean();
        this.init_view();
    }
    private init_view(){
        
        this.add_component({
            tag : "ExpressionConfig",
            expression : "A + B = 5"
        });

        this.add_component({
            tag : "ExpressionConfig",
            expression : "A - B = 3"
        });
        this.add_component({
            tag : "ExpressionConfig",
            expression : "A = ?"
        });
        this.add_component({
            tag : "ExpressionConfig",
            expression : "B = ?"
        });
    }
};

export class Controller extends QuestionController{
    constructor() {
        super();
        this.question_templates.push({
            template : Question_1,
            title : "和差问题",
        });
    }
};