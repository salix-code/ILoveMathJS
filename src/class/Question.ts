import { Container, Graphics, Text,Point, NineSliceSpriteGpuData } from 'pixi.js';
import { Pipeline } from '../actions/pipeline';
import type { BaseRender } from '../actions/basesystem';



export class QuestionView extends Container{
    protected answer_index : number = 0;
    protected draw_answer_function:((is_clear:boolean) => void)[] = [];
    protected m_pipeline : Pipeline = new Pipeline();
    protected m_needRedrawTags : string[] = [];
    private m_renders : BaseRender[] = [];
    constructor(title:string){
        super()
        
    }

    protected RegisterRender(render : BaseRender){
        this.m_renders.push(render);
    }
    public Tick(){
        
    }
    
    public clean(){
        this.answer_index = 0;
        const childrenToRemove = this.children.filter(child => child.label != "dontclean");
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

    public redraw(){
        if(this.m_pipeline){
            this.m_pipeline.redraw(...this.m_needRedrawTags);
            this.m_needRedrawTags = []
        }

        for(let render of this.m_renders){
            render.redraw();
        }
    }
    protected requestUpdate(...tags:string[]){
        this.m_needRedrawTags.push(...tags);
    }

    
};

type QuestionTemplate = {
    template : typeof QuestionView,
    title : string,
}

export class QuestionController extends Container {
    private question!:QuestionView;
    private question_index: number = -1;

    protected question_templates : QuestionTemplate[] = [];
    private title_label!:Text ;

    constructor() {
        super();
        
    }
    public start(){
        if(this.question_templates.length > 0){
            this.question_index = 0;
            this.create_question();
        }
    }

    private create_title(title:string){
        this.title_label = new Text()
        this.title_label.style = { fill: 'white', fontSize: 24 };
        this.title_label.text = title
        this.title_label.x = 300;
        this.title_label.y = 10;
        this.title_label.label = "dontclean";
        this.addChild(this.title_label)
    }
    private step_question(direction : number){
        const next_question = this.question_index + direction;
        if(next_question < 0){
            return;
        }
        if(next_question >= this.question_templates.length){
            return;
        }

        if(this.question != null){   
            this.removeChild(this.question);
        }
        this.question_index = next_question;
        this.create_question();
    }
    private step_answer(direction:number){
        if(this.question != null){
            this.question.step(direction);
        }
    }
    public tick(delta: number):void{
        if(this.question){
            //this.question.tick(delta);
        }
    }

    private create_question(){
        const question_template = this.question_templates[this.question_index]!;
        if(this.title_label == null){
            this.create_title(question_template.title);
        }else{
            this.title_label.text = question_template.title;
        }
        
        this.question = new question_template.template(question_template.title);
        this.question.x = 0;
        this.question.y = 30;
        this.addChild(this.question);
    }
    private regenerated(){
        if(this.question != null){
            this.question.regenerate();
        }
    }

    public onKeyDown(e: KeyboardEvent){
        if (e.key === 'ArrowRight') {
            this.step_answer(1);
        } else if (e.key === 'ArrowLeft') {
            this.step_answer(-1);
        } else if (e.key === 'ArrowUp') {
            this.step_question(-1)
        } else if (e.key === 'ArrowDown') {
            this.step_question(1);
        }
        else if (e.key === '`'){
            this.regenerated();
        }
    }
    public redraw(){
        if(this.question){
            this.question.redraw()
        }
    }
}