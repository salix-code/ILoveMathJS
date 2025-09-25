import { Container, Graphics, Text,Point } from 'pixi.js';
import {QuestionView,QuestionController} from "../class/Question"

class Question_1 extends QuestionView{
    constructor(title:string) {
        super(title);
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
            title : "求周长就是求线段长",
        });
    }
};