import { Container, Graphics, Text,Point, type TextOptions, TextStyle } from 'pixi.js';

import {Expression, type ExpressionConfig} from "../component/expression"
import { AnimationSystem } from '../class/anim';
import { Arrow } from '../component/arrow';
import { QuestionController, QuestionView } from '../class/Question';


import { Pipeline} from '../actions/pipeline';
import type { QuestionTableItem } from '../class/table_item';


class Question_1 extends QuestionView{
    
    private first_dividend:number = 25;
    private second_dividend:number = 31;
    private divisor:number = 8;

    private divisor_index:number[] = [];

    constructor(title:string) {
        super(title)
        this.draw_answer_function = [
            this.answer_0.bind(this),
            this.answer_1.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
            this.answer_4.bind(this),
        ];
        this.regenerate();
    }
    
    public regenerate(){
        this.clean();

        this.divisor = Math.floor(Math.random() * 10) + 3;
        const result = Math.floor(Math.random() * 5) + 5;
        this.first_dividend = Math.floor(Math.random() * this.divisor * result / 2);
        const flag = Math.random() > 0.5;
        this.second_dividend = result * this.divisor - this.first_dividend * ( flag ? 1 : -1);
        const expression = this.first_dividend + " / " + this.divisor + flag?" + ":" - " + this.second_dividend + " / " + this.divisor + " = ?"
        
        this.m_pipeline.push_slot("init").create_expression(expression,100,50).attach_to(this).pop_slot();

    }
    private answer_0(){
        let view = this.m_pipeline.get_view_by_tag("init");
        if(view){
            const expression = view as Expression;
            expression.change_label_color(2,'yellow');
            expression.change_label_color(6,'yellow');

            this.m_pipeline.push_slot('tip').create(Text,{"style" : { fill: 'white', fontSize: 18 }} as TextOptions).attach_to(this).set_position(100,100).pop_slot();
            const tip = this.m_pipeline.get_view_by_tag("tip");
            if(tip){
                (tip as Text).text = "找到他们相同的公共数字";
            }
           // tip.text = " "
        }
        
    }
    private answer_1(){

        this.m_pipeline.push_slot("answer.1").create_expression("( _ + _ ) / (相同的数字)",100,140).attach_to(this).pop_slot();
    }

    private answer_2(){

        let view1 = this.m_pipeline.get_view_by_tag("init") as Expression;
        const label1 = view1.get_label(2)!;
        const point1 = label1.getGlobalPosition()
        const label2 = view1.get_label(6)!;
        const point2 = label2.getGlobalPosition();

        const view3 = this.m_pipeline.get_view_by_tag("answer.1") as Expression;

        let expression = view3 as Expression;
        let label3 = expression.get_label(6)!;
        label3.text = this.divisor + ""
        const point3 = label3.getGlobalPosition();
        
        point3.y -= 30;

        //this.m_pipeline.push_slot("answer.2.arrow.1").create(Arrow,point1.x + 5,point1.y,point3.x + 10,point3.y).attach_to(this).pop_slot();
       // this.m_pipeline.push_slot("answer.2.arrow.2").create(Arrow,point2.x + 5,point2.y,point3.x + 15,point3.y).attach_to(this).pop_slot();
    }
    private hide_arrow(tag:string){
        const arrow = this.m_pipeline.get_view_by_tag(tag)!;
        this.removeChild(arrow);
    }
    private answer_3(){
        this.hide_arrow("answer.2.arrow.1");
        this.hide_arrow("answer.2.arrow.2");


        this.m_pipeline.push_slot('tip').create(Text,{"style" : { fill: 'white', fontSize: 18 }} as TextOptions).attach_to(this).set_position(100,200).pop_slot();
            const tip = this.m_pipeline.get_view_by_tag("tip");
            if(tip){
                (tip as Text).text = "把被除数放在括号里面";
            }
        
        const expression = "( " + " ___ " + " + " + " ___ " + " )" + " / " + this.divisor;
        this.m_pipeline.push_slot("answer.3").create_expression(expression,100,240).attach_to(this).pop_slot();
        
        //
        const init_expression = this.m_pipeline.get_view_by_tag("init") as Expression;
        const first = init_expression.get_label(0)!;
        const target_expression = this.m_pipeline.get_view_by_tag("answer.3") as Expression;
        const first_target_point = target_expression.get_label(1)!.getGlobalPosition();
        this.m_pipeline.push_slot("answer.3.anim.2").clone(first,this).move_to_view(target_expression.get_label(1)!).pop_slot();

        const second = init_expression.get_label(4)!;
        const second_target_point = target_expression.get_label(3)!.getGlobalPosition();
        const cb = this.on_answer_3_cb.bind(this);
        this.m_pipeline.push_slot("answer.3.anim.2").clone(second,this).move_to_view(target_expression.get_label(3)!,cb).pop_slot();
        
    }
    private on_answer_3_cb(){
        const expression = this.m_pipeline.get_view_by_tag("answer.3") as Expression;
        expression.remove_label(1);
        expression.remove_label(3);
    }
    private answer_4(){
        const result = (this.first_dividend + this.second_dividend) / this.divisor;
        const expression = "(" + this.first_dividend + " + " + this.second_dividend + ") / " + this.divisor + " = " + result;
        this.m_pipeline.create_expression(expression,300,230);
    }
    
}

class Question_2 extends QuestionView{
    private m_dividends:number[] = []
    private m_divisor : number = 0;
    private m_showDivisionLabelIndex :number = 0;

    private m_resultValue:number = 0;

    constructor(title:string){
        super(title);
        this.draw_answer_function = [
            this.answer_0.bind(this),
            this.answer_show_division_label.bind(this),
            this.answer_show_division_label.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
        ];
        this.regenerate();
    }
    public regenerate(): void {
        this.clean();
        this.m_dividends = [];
        this.m_divisor = 0;

        const divisor_pool :number[] = [5,6,7,8,9,10,11,0];
        const divisor_index = Math.floor(Math.random() * divisor_pool.length);
        if(divisor_index >= 0 && divisor_index < divisor_pool.length){
            this.m_divisor = divisor_pool[divisor_index]!;
            if(this.m_divisor == 0){
                this.m_divisor = Math.floor(Math.random() * 88) + 12;
            }
        }
        
        const dividend_count = Math.floor(Math.random() * 4) + 2;
        for(let i = 0; i < dividend_count; ++i){
            const dividend = Math.floor(Math.random() * 8 + 2) * this.m_divisor;
            this.m_resultValue += dividend;
            this.m_dividends.push(dividend);
        }

        this.m_resultValue /= this.m_divisor;
        let expression = "( ";
        for(let x of this.m_dividends){
            expression += x + " + "
        }
        if(this.m_dividends.length > 0){
            expression = expression.slice(0,-3);
        }
        expression += " ) / " + this.m_divisor;

        this.create_expression(expression);
        
    }

    private create_expression(expression:string){
        this.m_pipeline.push_slot("expression").create_expression(expression,100,50).attach_to(this).pop_slot();
    }
    private answer_0(){
        this.m_pipeline.push_slot("tips.0").create(Text,{"style" : { fill: 'white', fontSize: 18 }} as TextOptions)
            .attach_to(this)
            .set_position(100,80)
            .pop_slot();
        const tip = this.m_pipeline.get_view_by_tag("tips.0") as Text;
        if(tip){
            tip.text = "检查每一项之和与除数关系是不是更简单"
        }
    }
    private create_division_label(){
        const m = this.m_dividends[this.m_showDivisionLabelIndex]!;
        const n = this.m_divisor;
        const expression = m +" / " + n + " = " + Math.floor( m / n);
        this.m_pipeline.push_slot("division.label." + this.m_showDivisionLabelIndex)
            .create_expression(expression,300 + this.m_dividends.length * 50,60 + this.m_showDivisionLabelIndex * 20)
            .attach_to(this)
            .pop_slot();
            
        this.m_showDivisionLabelIndex += 1;
    }

    private answer_show_division_label(){
        if(this.m_showDivisionLabelIndex == 0){
            this.create_division_label();
        }
        else{
            while(this.m_showDivisionLabelIndex < this.m_dividends.length){
                this.create_division_label();
            }
        }
    }
    

    private answer_2(){
        let expression = "";
        for(let d of this.m_dividends){
            expression += d + " / " + this.m_divisor + " + ";
        }
        if(this.m_dividends.length > 0){
            expression = expression.slice(0,-3);
        }
        const height = 130 + this.m_dividends.length * 20
        this.m_pipeline.push_slot("answer.2")
            .create_expression(expression,100,height)
            .attach_to(this)
            .pop_slot();
        
        
    }
    private answer_3(){
        const expression = this.m_pipeline.get_view_by_tag("expression") as Expression;
        const answer = this.m_pipeline.get_view_by_tag("answer.2") as Expression;
        for(let i = 0; i < this.m_dividends.length; ++i){
            const label = expression.get_label(1 + i * 2);
            const target = answer.get_label(i * 4);
            if(label && target){
                // this.m_pipeline.push_slot("answer.3.arrow." + i)
                //     .make_arrow(label,target,this)
                //     .pop_slot();
            }
        }
    }
    private answer_4(){
        let expression:string = this.m_resultValue + "";
        
        this.m_pipeline.push_slot("answer_2").create_expression(expression,200,50).attach_to(this).pop_slot();
    }
}

export class Math_3_4 extends QuestionController {
    
    constructor(x : number,y:number) {
        super();
        this.question_templates.push({
            template:Question_1,
            title:"除法提取公共因子(除数)"
        },{
            template:Question_2,
            title:"除法拆式"
        })
        
    }
}

export const APP_Math_3_4 : QuestionTableItem = {
    category: "奥数",
    title: "巧算除法",
    creator: ()=> new Math_3_4(0,0)
}
