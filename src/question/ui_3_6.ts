import { Container, Graphics, Text,Point } from 'pixi.js';
import {QuestionView,QuestionController} from "../class/Question"
import { Expression } from '../component/expression';
import type { QuestionTableItem } from '../class/table_item';


class Question_1 extends QuestionView{
    private expression:Expression[] = [];
    
    constructor(title:string) {
        super(title);
        this.draw_answer_function = [
            
        ]
        
        this.regenerate();
    }
    public regenerate(): void {
        this.clean();
        
    }

};

class Controller extends QuestionController{
    constructor() {
        super();
        this.question_templates.push({
            template : Question_1,
            title : "和差问题",
        });
    }
};


export const APP_Math_3_6 : QuestionTableItem = {
    category: "奥数",
    title: "和差问题",
    creator: ()=> new Controller()
}