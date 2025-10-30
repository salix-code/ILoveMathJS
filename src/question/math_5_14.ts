import { Container } from "pixi.js";
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
import { HorizontalSegmentOperator, type HorizontalSegmentInitializer } from "../component/segment";
import { DelayManager } from "../actions/delaymanager";
import type { EllipseDesc, QuestionGraphConstructor, TextDesc } from "../component/questionngraph";
import type { VerticalListTextInitializer } from "../component/listtext";

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
            this.answer_5.bind(this),
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
        this.m_pipeline.make_horiaontal_segment(this.m_segment_initializer[0]!).set_position(100,40).attach_to(this.analyze_panel).tag("answer.1.segment")
        
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

        this.m_pipeline.make_horiaontal_segment(this.m_segment_initializer[1]!).set_position(100,100).attach_to(this.analyze_panel).tag("answer.2.segment");

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
        },0.3)
        .delay(()=>{
            
        });
    }

    private answer_4(){
        
        HorizontalSegmentOperator.hide(0,this.m_segment_initializer[0]!);
        HorizontalSegmentOperator.hide(0,this.m_segment_initializer[1]!);
        const length_tip = string_format("多{0}个，共{1}份",this.m_number.x * (this.m_number.a - 1),this.m_number.a - 1);

        this.m_segment_initializer[1]?.length_tip?.push({range:[1,this.m_number.a - 1],text : length_tip});
        this.m_pipeline.redraw("answer.1.segment","answer.2.segment");

        this.m_pipeline.make_text("4. 求出每一份的长度后，是不是就可以求出球的数量了。",14).attach_to(this.tip_panel).set_position(0,160);
    }

    private answer_5(){
        const n = this.m_number.a - 1
        const m = this.m_number.x * n
        const text = string_format("最后求出一份的数据是：{0} ÷ {1} = {2}",m,n,this.m_number.x)
        this.m_pipeline.make_text(text,32).attach_to(this.analyze_panel).set_position(120,240);
    }
}

class Question_2 extends QuestionView{
    private m_number : {x : number,y : number , n:number,a : number} = {x : 0,y : 0,n : 0,a : 0}
    private m_segment_width : number = 0;
    private m_first_segment_y : number = 80;
    private m_seconnd_segment_y : number = 200;
    private m_question: QuestionGraphConstructor = {} as QuestionGraphConstructor;
    private m_tip : VerticalListTextInitializer = {} as VerticalListTextInitializer;
    private analyze_panel:Container | null = null;
    private tip_panel : Container | null = null;
    constructor(){
        super("")

        this.draw_answer_function = [
            this.answer_0.bind(this),
            this.answer_1.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
            this.answer_4.bind(this),
        ]

        this.regenerate();
    }
    // x = ny-(n-1)a
    public regenerate(): void {

        this.clean();
        const question_array = [
            "足球有{0}个，蓝球有{1}个，老师拿走同样多的足球和蓝球后，足球是蓝球的{2}倍，\n请问现在球和蓝球各有多少个？",
            "甲队有{0}人，乙队有{1}人，两队调走同样的人后，甲队人数是乙队人数的{2}倍，\n请问调动后两队还有多少人?"
        ];

        this.m_number.n = Math.floor(Math.random() * 3 + 2);
        this.m_number.a = Math.floor(Math.random() * 12 + 3);

        this.m_number.y = Math.floor(Math.random() * 10 + this.m_number.a + 1);
        this.m_number.x = this.m_number.y * this.m_number.n - (this.m_number.n - 1) * this.m_number.a;
        
        this.m_segment_width = 100;
        if(this.m_number.n > 5) {
            this.m_segment_width = Math.floor(this.m_segment_width * (10 / this.m_number.n));
        }

        this.m_question = {
            segment : [{points:[]},{points:[]}]
        } as QuestionGraphConstructor

        const question_index = Math.floor(Math.random() * question_array.length);
        const question_text = string_format(question_array[question_index]!,this.m_number.x,this.m_number.y,this.m_number.n);
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100,80);
        this.m_pipeline.make_horiaontal_line(0,0,1024).set_position(80,160).attach_to(this);
        

        this.analyze_panel = new Container();
        this.analyze_panel.x = 100;
        this.analyze_panel.y = 160;
        this.addChild(this.analyze_panel);

        this.tip_panel = new Container();
        this.tip_panel.x = 800;
        this.tip_panel.y = 160;
        this.addChild(this.tip_panel);

        
    }
    private answer_0(){

        const begin_x = Math.floor(this.m_segment_width * (this.m_number.y - this.m_number.a) / this.m_number.a) + 20

        this.m_question.segment[0]!.points.push([begin_x,this.m_first_segment_y],[begin_x + this.m_segment_width,this.m_first_segment_y]);
        this.m_question.segment[1]!.points.push([begin_x,this.m_seconnd_segment_y])
        for(let i = 1; i < this.m_number.n + 1; ++i){
            this.m_question.segment[1]!.points.push([begin_x + i * this.m_segment_width,this.m_seconnd_segment_y])
        }

        this.m_question.curly = [{
                x1 : begin_x,
                y1:this.m_first_segment_y - 6,
                x2 : begin_x + this.m_segment_width,
                y2 : this.m_first_segment_y - 6,
                text : "1份",
                height : 8
            },{
                x1 : begin_x,
                y1:this.m_seconnd_segment_y + 6,
                x2 : this.m_question.segment[1]!.points[this.m_number.n]![0],
                y2 : this.m_seconnd_segment_y + 6,
                text : string_format("{0}份",this.m_number.n),
                height : -8
            }
        ];
        // this.m_question.text = [{
        //     x : begin_x,
        //     y : 70,
        //     text : string_format("画出比例关系==> 1 比 {0}",this.m_number.n)
        // }];

        this.m_tip = {items : [{text:string_format("画出比例关系==> 1 比 {0}",this.m_number.n)}]};

        this.m_pipeline.make_question_graph(this.m_question).attach_to(this.analyze_panel).set_position(10,10).tag("question_graph");

        this.m_pipeline.make_vertical_text(this.m_tip).attach_to(this.tip_panel).set_position(0,0).tag("tip_vertical")
    }
    private answer_1(){
        const point_1 = this.m_question.segment[0]!.points[0]
        const point_2 = this.m_question.segment[1]!.points[0]
        const point_3 = this.m_question.segment[0]!.points[1]
        const point_4 = this.m_question.segment[1]!.points[1]

        this.m_question.segment.push(
            {points : [point_1!,point_2!],color:'red',type : 1}
            ,{points : [point_3!,point_4!],color:'red',type : 1}
        );

        //this.m_question.text![0]!.text = "="
        //this.m_question.text![0]!.x = (point_1![0] + point_3![0]) / 2

        this.requestUpdate("question_graph","tip_vertical");
    }
    private answer_2(){
        //const width = Math.floor(this.m_segment_width * (this.m_number.y - this.m_number.a) / this.m_number.a)

        this.m_question.segment[0]!.points.splice(0,0,[20,20])
        this.m_question.segment[1]!.points.splice(0,0,[20,120])

        this.requestUpdate("question_graph");
    }
    private answer_3(){
        const point_1 = this.m_question.segment[0]!.points[0];
        const point_2 = this.m_question.segment[1]!.points[0];

        this.m_question.segment.splice(2,1,
            {points : [point_1!,point_2!],color:'red',type : 1}
        );
        const point_3 = this.m_question.segment[1]!.points[2];

        //this.m_question.text![0]!.x = (point_1![0] + point_3![0]) / 2
        this.requestUpdate("question_graph");
    }

    private answer_4(){
        const point_1 = this.m_question.segment[1]!.points[2];
        const point_2 = this.m_question.segment[1]!.points[this.m_number.n + 1];
        this.m_question.ellipse = [{
            x : (point_1![0] + point_2![0]) / 2,
            y : point_1![1],
            rx : Math.abs((point_1![0] - point_2![0]) / 2),
            ry : 0.42 * Math.abs((point_1![0] - point_2![0]) / 2)

        } as EllipseDesc];

        this.requestUpdate("question_graph");
    }
}

class Controller extends QuestionController{
    constructor() {
        super();
        this.question_templates.push({
            template : Question_1,
            title : "简单差倍 - 1",
        },{
            template : Question_2,
            title : "简单差倍 - 2",
        });
    }
};

export const APP_Math_5_14 : QuestionTableItem = {
    category: "奥数",
    title: "差倍问题",
    creator: ()=> new Controller()
}