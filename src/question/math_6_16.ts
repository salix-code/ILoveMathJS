import * as PIXI from 'pixi.js';
import { BaseRender } from "../actions/basesystem";
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";

function string_format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => String(args[index]));
}

class DataDefinition {
    public texts : {text:string,x:number,y : number}[] = [];
    public need_redraw : boolean = false;
    public addText(text:string,x:number,y:number){
        this.texts.push({text,x,y});
        this.need_redraw = true;
    }
    
}

class Render extends BaseRender{
    private m_data: DataDefinition;
    constructor(data: DataDefinition, container: PIXI.Container, x: number = 0, y: number = 0){
        super(container,x,y);
        this.m_data = data;
    }

    public redraw(): void {
        this.m_graphics.clear();
    }
}


class MathView extends QuestionView{
    protected m_number: { a: number, b: number, c: number, d: number, e:number} = { a: 2, b: 6, c: 6, d: 3, e:4 }
    private m_data : DataDefinition = new DataDefinition();
    constructor(){
        super("")
        this.RegisterRender(new Render(this.m_data,this,100,160));

        this.draw_answer_function = [
            this.answer_0.bind(this),
        ]
        this.regenerate();
    }
    public regenerate(): void {
        const question_array = [
            "{0}只羊可以換{1}只兔子，{2}只羊可能以換{3}頭駱駝，{4}只駱駝可以換幾只兔子？",
        ];
        
        const question_index = Math.floor(Math.random() * question_array.length);
        const question_text = string_format(question_array[question_index]!, this.m_number.a, this.m_number.b,this.m_number.c,this.m_number.d,this.m_number.e);
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
    }
    private answer_0(){
        this.m_data.addText(string_format("{0} 兔子 = {1} 羊",this.m_number.b,this.m_number.a),0,0);
        this.m_data.addText(string_format("{0} 羊 = {1} 駱駝",this.m_number.c,this.m_number.d),0,40);
        
    }
    
}

class Question_1 extends MathView{
    
}


class Question_2 extends MathView{
    
}


class Question_3 extends MathView{
    
}


class Question_4 extends MathView{
    
}

class Question_5 extends MathView{
    
}

class Controller extends QuestionController {
    constructor() {
        super();
        this.question_templates.push({
            template: Question_1,
            title: "以物換物",
        }, {
            template: Question_2,
            title: "简单差倍 - 2",
        }, {
            template: Question_3,
            title: "简单差倍 - 3",
        }, {
            template: Question_4,
            title: "简单差倍 - 4",
        });
    }
};


export const APP_Math_6_16: QuestionTableItem = {
    category: "奥数",
    title: "等量代换",
    creator: () => new Controller()
}