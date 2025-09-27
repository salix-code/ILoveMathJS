import { Container, Graphics, Text,Point } from 'pixi.js';

import {Expression} from "../component/expression.js"
import { AnimationSystem } from '../component/anim.js';
import { Arrow } from '../component/arrow.js';
import { QuestionController, QuestionView } from '../class/Question.js';

class Question extends QuestionView{
    protected created_labes:Text[] = []
    
    constructor(title:string){
        super(title);
    }
    public clone_label(src_label:Text):Text{
        let label = new Text();
        label.style = src_label.style;
        label.text = src_label.text;
        let position:Point = src_label.getGlobalPosition();
    
        label.position = this.toLocal(position,this);
        this.addChild(label);
        this.created_labes.push(label);
        return label;
    }
}

class Question_1 extends QuestionView{
    private expression!:Expression;
    private created_expressions:Expression[] = [];

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
        
        this.created_expressions = [];
        this.divisor = Math.floor(Math.random() * 97) + 3;
        const result = Math.floor(Math.random() * 5) + 5;
        
        this.first_dividend = Math.floor(Math.random() * this.divisor * result / 2);
        this.second_dividend = result * this.divisor - this.first_dividend;

        const expression = this.first_dividend + " / " + this.divisor +  " + " + this.second_dividend + " / " + this.divisor + " = ?"
        this.expression = new Expression(expression);
        this.divisor_index.push(2,6);
        this.expression.x = 300;
        this.expression.y = 100;
        this.addChild(this.expression)
    }
    private answer_0(is_clear:boolean){
        if(is_clear){

        }
        else{
            for(let index of this.divisor_index){
                let divisor_label:Text = this.expression.get_label(index);
                divisor_label.style.fill = "yellow";
                divisor_label.style.fill = "yellow";
            }
        }
    }
    private answer_1(is_clear:boolean){
        if(is_clear){

        }
        else{

            const expression = new Expression("( _ _ _ ) / _");
            this.created_expressions.push(expression);
            expression.x = 300;
            expression.y = 130;
            this.addChild(expression);
        }
    }
    private answer_2(is_clear:boolean){
        if(is_clear){

        }
        else{
            // from
            let first_divisor_label:Text = this.expression.get_label(2);
            const anim_label = this.clone_label(first_divisor_label);
            let position:Point = first_divisor_label.getGlobalPosition();
            let second_divisor_label:Text = this.expression.get_label(6);
            const second_position:Point = first_divisor_label.getGlobalPosition();

            // to
            const expression = this.created_expressions[0]!;
            let target_label = expression.get_label(-1);
            let target_position = target_label.getGlobalPosition();
            expression.remove_label(-1);
            
            this.fly_to(anim_label,target_position.x,target_position.y,2);

            this.make_arrow(position.x,position.y,target_position.x,target_position.y);
            this.make_arrow(second_position.x,second_position.y,target_position.x,target_position.y);
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