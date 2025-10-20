import { Container } from "pixi.js";
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
import { HorizontalSegmentOperator, type HorizontalSegmentInitializer } from "../component/segment";
import { DelayManager } from "../actions/delaymanager";

function string_format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => String(args[index]));
}


class Question_1 extends QuestionView {
    private analyze_panel:Container | null = null;
    private tip_panel : Container | null = null;
    private m_number : {a : number,x : number} = {a : 0,x : 0};
    private m_segment_initializer : HorizontalSegmentInitializer[] = []
    private m_name : string[] = ["排球","足球"];
    constructor(){
        super("")
        this.draw_answer_function = [
            this.answer_1.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
            this.answer_4.bind(this),
        ]
        
        this.regenerate();
    }
    public regenerate(): void {
        this.clean();
        
        const question_array = [
            "问题：足球是排球的{0}倍，足球比排球多{1}个，请问足球和排球各多少个？"
        ]

        this.m_number.a = Math.floor(Math.random() * 6 + 3);
        this.m_number.x = Math.floor(Math.random() * 20 + 1);

        const question_index = Math.floor(Math.random() * question_array.length);

        const question_text = string_format(question_array[question_index]!,this.m_number.a,this.m_number.x * (this.m_number.a - 1));
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100,80);
        this.m_pipeline.make_horiaontal_line(0,0,1024).set_position(80,120).attach_to(this);
        this.analyze_panel = new Container();
        this.analyze_panel.x = 100;
        this.analyze_panel.y = 125;
        this.addChild(this.analyze_panel);

        this.tip_panel = new Container();
        this.tip_panel.x = 800;
        this.tip_panel.y = 125;
        this.addChild(this.tip_panel);

        this.m_segment_initializer = [{
                begin_point : {x : 0,y : 20},
                scale : 1,
                segments:[],
                length_tip : []
            },{
                begin_point : {x : 0,y : 20},
                scale : 1,
                segments:[],
                length_tip : []
            },
        ]

    }

    private answer_1(){
        this.m_pipeline.make_text(this.m_name[0]!).set_position(10,40).attach_to(this.analyze_panel);
        this.m_pipeline.make_horiaontal_segment(this.m_segment_initializer[0]!).set_position(80,40).attach_to(this.analyze_panel).tag("answer.1.segment")
        
        DelayManager.getInstance().create().delay(()=>{
            this.m_pipeline.make_text("1. 已知最小的球是排球，先画出线",14).attach_to(this.tip_panel).set_position(0,40);
        },1).delay(()=>{
            this.m_segment_initializer[0]?.segments.push({width : 60,tip : ""});
            this.m_pipeline.redraw("answer.1.segment") 
        },1).delay(()=>{
            this.m_segment_initializer[0]!.segments[0]!.tip = "1";
            this.m_pipeline.redraw("answer.1.segment") 
        })

        
    }

    private answer_2(){
        this.m_pipeline.make_text(this.m_name[1]!).set_position(10,100).attach_to(this.analyze_panel);

        this.m_pipeline.make_horiaontal_segment(this.m_segment_initializer[1]!).set_position(80,100).attach_to(this.analyze_panel).tag("answer.2.segment");

        DelayManager.getInstance().create().delay(()=>{},1).delay(()=>{
            const num = this.m_segment_initializer[1]?.segments.length!;
            this.m_segment_initializer[1]?.segments.push({width : 60,tip : (num + 1) + ''});
            this.m_pipeline.redraw("answer.2.segment")
        },1,this.m_number.a)

        this.m_pipeline.make_text("2. 根据排球，画出足球的数量表示",14).attach_to(this.tip_panel).set_position(0,80);
    }

    private answer_3(){

        DelayManager.getInstance().create()
        .delay(()=>{},1)
        .delay((loop_counter:number)=>{
            const segment =  this.m_segment_initializer[1]?.segments[1 + loop_counter];
            if(segment){
                segment.color = "red";
            }
            this.m_pipeline.redraw("answer.2.segment");
            
        },1,this.m_number.a - 1)
        .delay(()=>{},2)
        .delay(()=>{
            this.m_pipeline.make_text("3.足球比排球多，多多少，是多几份",14).attach_to(this.tip_panel).set_position(0,120);
        },0.5)
        .delay(()=>{
            
        });
    }

    private answer_4(){
        
        HorizontalSegmentOperator.remove(0,this.m_segment_initializer[0]!);
        HorizontalSegmentOperator.remove(0,this.m_segment_initializer[1]!);
        this.m_segment_initializer[1]!.begin_point.x = 60;

        this.m_segment_initializer[1]?.length_tip?.push({
                range : [0,this.m_number.a - 2],
                text : String(this.m_number.x * (this.m_number.a - 1))
            })

        this.m_pipeline.redraw("answer.2.segment");

        this.m_pipeline.make_text("4. 求出每一份的长度后，是不是就可以求出球的数量了。",14).attach_to(this.tip_panel).set_position(0,160);
    }
}

class Controller extends QuestionController{
    constructor() {
        super();
        this.question_templates.push({
            template : Question_1,
            title : "简单差倍 - 1",
        });
    }
};

export const APP_Math_5_14 : QuestionTableItem = {
    category: "奥数",
    title: "差倍问题",
    creator: ()=> new Controller()
}