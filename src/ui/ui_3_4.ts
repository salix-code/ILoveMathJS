import { Container, Graphics, Text,Point } from 'pixi.js';

import {Expression} from "../component/expression.js"
import { AnimationSystem } from '../component/anim.js';
import type { Arrow } from '../component/arrow.js';

class Question extends Container{
    protected answer_index : number = 0;
    protected draw_answer_function:((is_clear:boolean) => void)[] = [];
    private title_label:Text;
    constructor(title:string){
        super()
        this.title_label = new Text()
        this.title_label.style = { fill: 'white', fontSize: 24 };
        this.title_label.text = title
        this.title_label.x = 300;
        this.title_label.y = 20;
        this.title_label.tag = "title";
        this.addChild(this.title_label)

    }
    public clean(){
        this.answer_index = 0;
        const childrenToRemove = this.children.filter(child => child.tag == "title");
        for (const child of childrenToRemove) {
            this.removeChild(child);
        }
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
    public step(d:number){
        const next_answer = this.answer_index + d;
        if(next_answer < 0 || next_answer > this.draw_answer_function.length){
            return;
        }
        if(d > 0){
            let func = this.draw_answer_function[this.answer_index]!;
            func(false);
        }
        else{
            let func = this.draw_answer_function[next_answer]!;
            func(true);
        }
        
        this.answer_index = next_answer;
    }

    public make_arrow(x1:number,y1:number,x2:number,y2:number) : Arrow{
        const arrow = new Arrow(x1, y1, x2, y2
            { color: 0xff0000, width: 2, headLength: 20 });
        this.addChild(arrow);
        return arrow;
    }

    public regenerate(){

    }

}

class Question_1 extends Question{
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

            this.make_arrow(position,x,position.y,target_position.x,target_position.y);
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
                this.fly_to(anim_label,target_position,2);

                this.make_arrow(position,x,position.y,target_position.x,target_position.y);
            }


        }
    }
    private answer_4(is_clear:boolean){
        if(is_clear){
            this.
        }
        else{
            const result = (this.first_dividend + this.second_dividend) / this.divisor;
            const expression = new Expression("(" + this.first_dividend + " + " + this.second_dividend + ") / " + this.divisor + " = " + result);
            this.created_expressions.push(expression);
            expression.x = 300;
            expression.y = 230;
            this.addChild(expression);
        }
    }
    
}

type QuestionTemplate = {
    template : typeof Question,
    title : string,
}

export class Math_3_4 extends Container {
    private question!:Question;
    private question_index: number = 0;

    private question_templates : QuestionTemplate[] = [];

    constructor(x : number,y:number) {
        super();

        this.question_templates = [
            {
                "template":Question_1,
                "title":"除法取公共因子"
            },
        ]
        
        window.addEventListener('keydown', this.onKeyDown);
    }
    private step_question(direction : number){
        const next_question = this.question_index + direction - 1;
        if(next_question < 0){
            return;
        }
        if(next_question >= this.question_templates.length){
            return;
        }

        if(this.question != null){   
            this.removeChild(this.question);
        }
        this.create_question();
        this.question_index = next_question;
    }
    private step_answer(direction:number){
        if(this.question != null){
            this.question.step(direction);
        }
    }
    public tick(delta: number):void{
        
    }

    private create_question(){
        const question_template = this.question_templates[this.question_index - 1]!;
        this.question = new question_template.template(question_template.title);
        this.addChild(this.question);
    }
    private regenerated(){
        if(this.question != null){
            this.question.regenerate();
        }
    }

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            this.step_answer(1);
        } else if (e.key === 'ArrowLeft') {
            this.step_answer(-1);
        } else if (e.key === 'ArrowUp') {
            this.step_question(1)
        } else if (e.key === 'ArrowDown') {
            this.question_index += 1;
            this.step_question(-1);
        }
        else if (e.key === '`'){
            this.regenerated();
        }
    }
}