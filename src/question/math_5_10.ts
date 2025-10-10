import { Container, Graphics, Text,Point } from 'pixi.js';
import {QuestionView,QuestionController} from "../class/Question"
import { Expression } from '../component/expression';
import type { QuestionTableItem } from '../class/table_item';


class Question_1 extends QuestionView{
    private expression:Expression[] = [];
    
    constructor(title:string) {
        super(title);
        this.draw_answer_function = [
            this.answer_0.bind(this),
            this.answer_1.bind(this),
            this.answer_2.bind(this)
        ]
        
        this.regenerate();
    }
    public regenerate(): void {
        this.clean();
        const begin = Math.floor(Math.random() * 20);
        const end = begin + Math.floor(Math.random() * 30);

        const expression = begin + " - " + end
        this.m_pipeline.push_slot("init").create_expression(expression,100,50).attach_to(this).pop_slot();

        this.m_pipeline.push_slot("answer.win.odd").create(Text,{text:"奇数多"}).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.win.even").create(Text,{text:"偶数多"}).attach_to(this).pop_slot();
    }
    private answer_0(){
        this.m_pipeline.push_slot("answer.0.tip").create(Text,{text:"1. 先看一个数情况"}).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.0.number").create(Text,{text:""}).attach_to(this).pop_slot();
    }
    private answer_1(){
        this.m_pipeline.push_slot("answer.1.tip").create(Text,{text:"2. 先看两个数情况"}).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.1.number.1").create(Text,{text:""}).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.1.number.2").create(Text,{text:""}).attach_to(this).pop_slot();
    }
    private answer_2(){
        this.m_pipeline.push_slot("answer.2.tip").create(Text,{text:"3. 先看三个数情况"}).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.2.number.1").create(Text,{text:""}).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.2.number.2").create(Text,{text:""}).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.2.number.3").create(Text,{text:""}).attach_to(this).pop_slot();
    }
};

class Controller extends QuestionController{
    constructor() {
        super();
        this.question_templates.push({
            template : Question_1,
            title : "奇数多还是偶数多？",
        });
    }
};


export const APP_Math_5_10 : QuestionTableItem = {
    category: "奥数",
    title: "奇数与偶数",
    creator: ()=> new Controller()
}