import { QuestionController, QuestionView } from "../class/Question";
import * as PIXI from 'pixi.js';
import { Line } from "../component/line";

type Rectangle = {
    w:number,
    h:number
}

type CuteConfig = {
    x:number,
    y:number
}

class RectangleView extends PIXI.Graphics{
    private m_rectangle : Rectangle;
    private m_smallRectangle:Rectangle;
    private m_cuteConfig:CuteConfig;
    private m_spanOfSmallRectangle : Rectangle;
    private m_spanOfCorner : Rectangle;

    constructor(){
        super()
        
        this.m_smallRectangle = {
            w : Math.floor(Math.random() * 7) + 3,
            h : Math.floor(Math.random() * 7) + 3
        }

        this.m_cuteConfig = {
            x : Math.floor(Math.random() * 2) + 3,
            y : Math.floor(Math.random() * 2) + 2
        }

        this.m_spanOfSmallRectangle = {
            w : Math.floor(Math.random() * 4) + 2,
            h : Math.floor(Math.random() * 4) + 2
        }
        this.m_spanOfCorner = {
            w : Math.floor(Math.random() * 4) + 2,
            h : Math.floor(Math.random() * 4) + 2
        }

        this.m_rectangle = {
            w : this.m_smallRectangle.w * this.m_cuteConfig.x + this.m_spanOfSmallRectangle.w * (this.m_cuteConfig.x - 1) + this.m_smallRectangle.h * 2 + this.m_spanOfCorner.w * 2,
            h : this.m_smallRectangle.h * this.m_cuteConfig.y + this.m_spanOfSmallRectangle.h * (this.m_cuteConfig.y - 1) + this.m_smallRectangle.w * 2 + this.m_spanOfCorner.h * 2
        }



        this.redraw();
    }

    private redraw(){
        this.clear();
        this.lineStyle(width, color);

        const left = 0;
        const top = 0;
        type Offset = {
            x:number,
            y:number 
        };

        const offset_list : Offset[] = [];
        // top
        offset_list.push({x:this.m_smallRectangle.h + this.m_spanOfCorner.w, y : 0});
        for(let i = 0; i < this.m_cuteConfig.x - 1; i++){
            offset_list.push({x:0, y : this.m_cuteConfig.y});
            offset_list.push({x:this.m_cuteConfig.x , y : 0});
            offset_list.push({x:0 , y : 0 - this.m_cuteConfig.y});
            offset_list.push({x:this.m_smallRectangle.w , y : 0});
        }

        if(this.m_cuteConfig.x > 0){
            offset_list.push({x:0, y : this.m_cuteConfig.y});
            offset_list.push({x:this.m_cuteConfig.x , y : 0});
            offset_list.push({x:0 , y : 0 - this.m_cuteConfig.y});
        }
        offset_list.push({x:this.m_smallRectangle.h + this.m_spanOfCorner.w, y : 0});

        // right
        offset_list.push({x:0,y : this.m_smallRectangle.h + this.m_spanOfCorner.h});
        for(let i = 0; i < this.m_cuteConfig.y - 1; i++){
            offset_list.push({x: 0 - this.m_smallRectangle.h, y : 0});
            offset_list.push({x:0, y : this.m_smallRectangle.w});
            offset_list.push({x:this.m_smallRectangle.h, y : 0});

            offset_list.push({x:0 , y : this.m_smallRectangle.h});
        }
        if(this.m_cuteConfig.y > 0){
            offset_list.push({x: 0 - this.m_smallRectangle.h, y : 0});
            offset_list.push({x:0, y : this.m_smallRectangle.w});
            offset_list.push({x:this.m_smallRectangle.h, y : 0});
        }
        offset_list.push({x:0, y : this.m_smallRectangle.h + this.m_spanOfCorner.h});

        // bottom
        offset_list.push({x: 0 - (this.m_smallRectangle.h + this.m_spanOfCorner.w), y : 0});
        for(let i = 0; i < this.m_cuteConfig.x - 1; i++){
            offset_list.push({x:0, y : -this.m_cuteConfig.y});
            offset_list.push({x:-this.m_cuteConfig.x , y : 0});
            offset_list.push({x:0 , y :this.m_cuteConfig.y});
            offset_list.push({x:-this.m_smallRectangle.w , y : 0});
        }

        if(this.m_cuteConfig.x > 0){
            offset_list.push({x:0, y : -this.m_cuteConfig.y});
            offset_list.push({x:-this.m_cuteConfig.x , y : 0});
            offset_list.push({x:0 , y :this.m_cuteConfig.y});
        }
        offset_list.push({x:0 - (this.m_smallRectangle.h + this.m_spanOfCorner.w), y : 0});
        // left
        offset_list.push({x:0,y : 0 - (this.m_smallRectangle.h + this.m_spanOfCorner.h)});
        for(let i = 0; i < this.m_cuteConfig.y - 1; i++){
            offset_list.push({x: this.m_smallRectangle.h, y : 0});
            offset_list.push({x:0, y : -this.m_smallRectangle.w});
            offset_list.push({x:-this.m_smallRectangle.h, y : 0});

            offset_list.push({x:0 , y : -this.m_smallRectangle.h});
        }
        if(this.m_cuteConfig.y > 0){
            offset_list.push({x: this.m_smallRectangle.h, y : 0});
            offset_list.push({x:0, y : -this.m_smallRectangle.w});
            offset_list.push({x:-this.m_smallRectangle.h, y : 0});
        }
        offset_list.push({x:0, y : 0 - (this.m_smallRectangle.h + this.m_spanOfCorner.h)});

        
        this.moveTo(left, top);
        for(let offset of offset_list){
            this.lineTo(offset.x, offset.y);
        }
        
    }
}


class Question_1 extends QuestionView {
    private m_rectangle!:RectangleView;
    constructor(title:string) {
        super(title);
        this.draw_answer_function = [
            this.answer_0.bind(this)
        ];

        this.regenerate();
    }
    public regenerate(): void {
        this.clean();

        this.m_rectangle = new RectangleView();
        this.m_rectangle.x = 300;
        this.m_rectangle.y = 230;
        this.addChild(this.m_rectangle);


    }

    private answer_0():void{
                
        this.m_pipeline.push_slot("answer.0").create(Line,0,0,0,0).attach_to(this).set_position(0,0).move_to(0,0).pop_slot();

    }
}

export class Math_5_8 extends QuestionController {
    
    constructor(x : number,y:number) {
        super();

        this.question_templates.push({
            template:Question_1,
            title:""
        })
        
    }
    
}