import { Container, Graphics, Text,Point } from 'pixi.js';

import {Expression} from "../component/expression.js"
import { AnimationSystem } from '../component/anim.js';
import { Arrow } from '../component/arrow.js';
import { QuestionController, QuestionView } from '../class/Question.js';
import { SystemManager } from '../system/system.js';
import { ExpressionSystem} from '../system/expressionsystem.js';


type ExpressionConfig = {
    expression:string,
    x:number,
    y:number,
}

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
    private answer_0(is_clear:boolean){
        if(is_clear){

        }
        else{
            const data_item:ExpressionData = this.m_expression[0]!;
            data_item.expression.change_label_color(2,'yellow');
            data_item.expression.change_label_color(2,'yellow');
        }
    }
    private answer_1(is_clear:boolean){
        if(is_clear){

        }
        else{
            this.create_expression({
                expression:"( _ + _ ) / _"
            } as ExpressionConfig);
        }
    }
    private answer_2(is_clear:boolean){
        if(is_clear){

        }
        else{
            let data_item:ExpressionData = this.m_expression[0]!;
            let label = data_item.expression.get_label(2);
            data_item = this.m_expression[1]!;
            label = data_item.expression.get_label(6)!
            const point = label.getGlobalPosition()
            this.clone_and_move_to(label,point);

            
        }
    }
    private answer_3(is_clear:boolean){
        if(is_clear){

        }
        else{
            const indexes =[0,4,0,2];
            for(let i = 0; i < 2; ++i){
                const dividend = this.expression.get_label(indexes[i]!)!;
                const anim_label = this.clone_label(dividend);
                const target_label = this.created_expressions[0]!.get_label(indexes[i+2]!);

                const target_position = target_label.getGlobalPosition();
                
            }


        }
    }
    private answer_4(is_clear:boolean){
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


export class Math_3_4 extends QuestionController {
    
    constructor(x : number,y:number) {
        super();

        this.question_templates.push({
            template:Question_1,
            title:"除法取公共因子"
        })
        
    }
    
}