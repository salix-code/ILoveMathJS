import { Container, Graphics, Text,Point } from 'pixi.js';

import {Expression, type ExpressionConfig} from "../component/expression.js"
import { AnimationSystem } from '../class/anim.js';
import { Arrow } from '../component/arrow.js';
import { QuestionController, QuestionView } from '../class/Question.js';


import { Pipeline} from '../actions/pipeline.js';


type ExpressionData = {
    expression :Expression,
    index : number
}

class Question_1 extends QuestionView{
    
    private first_dividend:number = 25;
    private second_dividend:number = 31;
    private divisor:number = 8;

    private divisor_index:number[] = [];

    private m_expression : ExpressionData[] = [];

    protected animation_system : AnimationSystem = new AnimationSystem();

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

    private create_expression(config:ExpressionConfig){
        const expression = new Expression(config.expression);
        expression.x = config.x;
        expression.y = config.y;
        this.addChild(expression);
        this.m_expression.push({
            expression:expression,
            index:0
        } as ExpressionData);
    }
    
    public regenerate(){
        this.clean();
        this.divisor = Math.floor(Math.random() * 97) + 3;
        const result = Math.floor(Math.random() * 5) + 5;
        this.first_dividend = Math.floor(Math.random() * this.divisor * result / 2);
        this.second_dividend = result * this.divisor - this.first_dividend;
        const expression = this.first_dividend + " / " + this.divisor +  " + " + this.second_dividend + " / " + this.divisor + " = ?"
        
        this.create_expression({
            expression : expression,
            x : 100,
            y : 50,
        } as ExpressionConfig)
    }
    private answer_0(){
        if(is_clear){

        }
        else{
            const data_item:ExpressionData = this.m_expression[0]!;
            data_item.expression.change_label_color(2,'yellow');
            data_item.expression.change_label_color(2,'yellow');
        }
    }
    private answer_1(){
        this.create_expression({
                expression:"( _ + _ ) / _"
            } as ExpressionConfig);
    }
    private answer_2(){
        if(is_clear){

        }
        else{
            let data_item:ExpressionData = this.m_expression[0]!;
            let label = data_item.expression.get_label(2);
            data_item = this.m_expression[1]!;
            label = data_item.expression.get_label(6)!
            const point = label.getGlobalPosition()
            const action_manager = ActionManager.getInstance();

            
            action_manager.run({
                stage : this,
                label:label,
                animation_system:this.animation_system,
                target_x:10,
                target_y:20,
            } as CloneAndMoveToConfig);
        }
    }
    private answer_3(){
        const action_manager = ActionManager.getInstance();

        const indexes =[0,1,4,3];
        for(let i = 0; i < 2; ++i){
            let data_item:ExpressionData = this.m_expression[0]!;
            let label = data_item.expression.get_label(i);
            data_item = this.m_expression[i]!;
            const target_label = data_item.expression.get_label(i + 1)!
            const target_point = target_label.getGlobalPosition();
            action_manager.run({
                stage : this,
                label:label,
                animation_system:this.animation_system,
                target_x:target_point.x,
                target_y:target_point.y,
            } as CloneAndMoveToConfig);
        }
    }
    private answer_4(){
        if(is_clear){
        
        }else{
            const result = (this.first_dividend + this.second_dividend) / this.divisor;
            const expression = new Expression("(" + this.first_dividend + " + " + this.second_dividend + ") / " + this.divisor + " = " + result);
            this.created_expressions.push(expression);
            expression.x = 300;
            expression.y = 230;
            this.addChild(expression);
        }
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
        expression += " / " + this.m_divisor;

        this.create_expression(expression);
        
    }

    private create_expression(expression:string){
        this.m_pipeline.push_slot("expression").create_expression(expression,100,50).pop_slot();
    }
    private create_division_label(){
        const expression = this.m_dividends[this.m_showDivisionLabelIndex]! +" / " + this.m_divisor;
        this.m_pipeline.push_slot("division.label." + this.m_showDivisionLabelIndex).create_expression(expression,200,50 + this.m_showDivisionLabelIndex * 50).pop_slot();
        this.m_showDivisionLabelIndex += 1;
    }

    private answer_show_division_label(){
        if(this.m_showDivisionLabelIndex < this.m_dividends.length){

            if(this.m_showDivisionLabelIndex == 0){
                this.create_division_label();
            }
            else{
                while(this.m_showDivisionLabelIndex < this.m_dividends.length){
                    this.create_division_label();
                }
            }
        }
        else{

        }
        
    }
    private answer_1(){
        const expression = "_ / _"
        this.m_pipeline.push_slot("answer_1.1").create_expression(expression,200,50).attach_to(this).pop_slot();
        this.m_pipeline.push_slot("answer_1.2").create_expression(expression,200,50).attach_to(this).pop_slot();
    }

    private answer_2(){
        let expression = "";
        for(let d of this.m_dividends){
            expression += d + " / " + this.m_divisor + " + ";
        }
        if(this.m_dividends.length > 0){
            expression = expression.slice(0,-3);
        }
        this.m_pipeline.push_slot("answer_2").create_expression(expression,200,50).attach_to(this).pop_slot();
    }
    private answer_3(){
        let expression = "";
        for(let d of this.m_dividends){
            expression += Math.floor(d / this.m_divisor) + " + ";
        }
        if(this.m_dividends.length > 0){
            expression = expression.slice(0,-3);
        }
        this.m_pipeline.push_slot("answer_2").create_expression(expression,200,50).attach_to(this).pop_slot();
    }
    private answer_4(){
        let expression = this.m_resultValue;
        
        this.m_pipeline.push_slot("answer_2").create_expression(expression,200,50).attach_to(this).pop_slot();
    }
}

export class Math_3_4 extends QuestionController {
    
    constructor(x : number,y:number) {
        super();

        this.question_templates.push({
            template:Question_1,
            title:"除法取公共因子"
        },{
            template:Question_2,
            title:"除法拆式"
        })
        
    }
    
}