import { Container, Graphics, Text,Point, type TextOptions } from 'pixi.js';
import {QuestionView,QuestionController} from "../class/Question"
import { Expression } from '../component/expression';
import type { QuestionTableItem } from '../class/table_item';
import { Line } from '../component/line';


class Question_1 extends QuestionView{
    private expression:Expression[] = [];
    private begin_number:number = 0;
    private end_number:number = 0
    
    constructor(title:string) {
        super(title);
        this.draw_answer_function = [
            this.answer_0.bind(this),
            this.answer_1.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
            this.answer_4.bind(this),
            this.answer_5.bind(this),
        ]
        
        this.regenerate();
    }
    public regenerate(): void {
        this.clean();
        this.begin_number = Math.floor(Math.random() * 20);
        this.end_number = this.begin_number + Math.floor(Math.random() * 30) + 5;

        const expression = "数列：" + this.begin_number + " ~ " + this.end_number
        this.m_pipeline.push_slot("init").create_expression(expression,100,50).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.win.odd").make_text("奇数多").set_position(120,100).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.win.even").make_text("偶数多").set_position(200,100).attach_to(this).pop_slot();
    }
    private is_odd(n : number){
        return n % 2 == 1;
    }
    private answer_0(){
        this.m_pipeline.push_slot("answer.0.linne").create(Line,500,50,500,600).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.0.tip").make_text("1. 先看一个数情况").set_position(600,50).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.0.number").make_text("" + this.begin_number).set_position(620,90).attach_to(this).pop_slot();
    }
    private answer_1(){
        this.m_pipeline.push_slot("answer.1.tip").make_text("2. 看两个数情况, 是不是一样多？").set_position(600,120).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.1.number.1").make_text(this.begin_number + "").set_position(620,150).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.1.number.2").make_text("" + (this.begin_number + 1)).set_position(660,150).attach_to(this).pop_slot();
    }
    private answer_2(){
        this.m_pipeline.push_slot("answer.2.tip").make_text("3. 看三个数情况").set_position(600,180).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.2.number.1").make_text("" + this.begin_number).set_position(620,210).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.2.number.2").make_text("" + (this.begin_number + 1)).set_position(650,210).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer.2.number.3").make_text("" + (this.begin_number + 2)).set_position(680,210).attach_to(this).pop_slot();

    }

    private answer_3(){
        const label = this.m_pipeline.get_view_by_tag("answer.2.number.3")!;
        const point = label.position;
        point.x -= 20;
        this.m_pipeline.push_slot("annswer.3.line").create(Line,point.x,point.y,point.x,point.y + 20).attach_to(this).pop_slot();
        
        this.m_pipeline.push_slot("answer.3.tip.1").make_text("到这里是一样多").set_position(620,230).attach_to(this).pop_slot();


        this.m_pipeline.push_slot("answer.3.arrow").make_arrow("answer.2.number.2","answer.3.tip.1",this).attach_to(this).pop_slot();


    }
    private answer_4(){
        this.m_pipeline.push_slot("answer.4.tip.1").make_text("多加了一个，加的数是奇数还是偶数？ ").set_position(620,240).attach_to(this).pop_slot();
    }

    private answer_5(){

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