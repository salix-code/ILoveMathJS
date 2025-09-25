import { Container, Graphics, Text,Point } from 'pixi.js';

export class QuestionView extends Container{
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
        this.title_label.label = "title";
        this.addChild(this.title_label)

    }
    public clean(){
        this.answer_index = 0;
        const childrenToRemove = this.children.filter(child => child.label == "title");
        for (const child of childrenToRemove) {
            this.removeChild(child);
        }
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

    public regenerate(){

    }
};

type QuestionTemplate = {
    template : typeof QuestionView,
    title : string,
}

export class QuestionController extends Container {
    private question!:QuestionView;
    private question_index: number = 0;

    protected question_templates : QuestionTemplate[] = [];

    constructor() {
        super();
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