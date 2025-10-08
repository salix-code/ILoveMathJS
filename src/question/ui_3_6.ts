import { Container, Graphics, Text,Point } from 'pixi.js';
import {QuestionView,QuestionController} from "../class/Question"
import { Expression } from '../component/expression';


class Question_1 extends QuestionView{
    private expression:Expression[] = [];
    
    constructor(title:string) {
        super(title);
        this.draw_answer_function = [
            
        ]
        
        this.init_view();
    }
    public regenerate(): void {
        this.clean();
        this.init_view();
    }
    private init_view(){
        
        
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