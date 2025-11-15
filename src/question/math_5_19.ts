import * as PIXI from 'pixi.js';
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
//import { RenderSystem } from '../actions/rendersystem';

class MathView extends QuestionView{
    protected m_textPanel: PIXI.Container | null = null;
    protected m_graphics : PIXI.Graphics | null = null;
    //protected m_render : RenderSystem | null = null;
    constructor(){
        super("")

        this.m_textPanel = new PIXI.Container();
        this.m_textPanel.x = 100;
        this.m_textPanel.y = 160;
        this.m_textPanel.label = "dontclean"
        this.addChild(this.m_textPanel);

        this.m_graphics = new PIXI.Graphics();
        this.m_graphics.x = 100;
        this.m_graphics.y = 160;
        this.m_graphics.label = "dontclean"
        this.addChild(this.m_graphics);
    }
    public clean(): void {
        super.clean();
        if(this.m_graphics){
            this.m_graphics.clear();
        }
        if(this.m_textPanel){
            this.m_textPanel.removeChildren();
        }
    }

    public redraw(){

    }
    public requestUpdate(tag:string){
        if(tag == "graph"){
            

        }
    }
}

class Question_1 extends MathView{
    constructor(){
        super();
    }
    public regenerate(): void {
        
    }
}

class Question_2 extends MathView{
    
}

class Question_3 extends MathView{
    
}


class Question_4 extends MathView{
    
}



class Controller extends QuestionController {
    constructor() {
        super();
        this.question_templates.push({
            template: Question_1,
            title: "简单差倍 - 1",
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


export const APP_Math_5_14: QuestionTableItem = {
    category: "奥数",
    title: "差倍问题",
    creator: () => new Controller()
}