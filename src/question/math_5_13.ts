import { Container,Text } from "pixi.js";
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
import { HorizontalSegmentOperator, type HorizontalSegmentInitializer } from "../component/segment";
import type { ArrowInitializer } from "../component/arrow";

function string_format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => String(args[index]));
}

type NumberPool = {
    a : number;
    x: number;
    y : number;
}

class Question_1 extends QuestionView{
    private analyze_panel:Container | null = null;
    private m_number : NumberPool = {a : 0, x : 0, y : 0}
    private m_segment_initializers : HorizontalSegmentInitializer[] = []
    constructor() {
        super("")
        this.draw_answer_function = [
            this.answer_0.bind(this),
            this.answer_1.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
            this.answer_4.bind(this),
            this.answer_5.bind(this),
            this.answer_6.bind(this),
            this.answer_7.bind(this),
        ]
        this.regenerate()
    }
    //[0,x] [x,a]
    public regenerate(): void {

        this.m_number.a =50;
        this.m_number.x = 20;
        this.m_number.y = 12;
        const total = this.m_number.a * 3 + this.m_number.y;
        const text = string_format("三个小朋友一共有{0}，\n每人花去相同的钱后，\n丙还剩下{1}元钱，\n乙剩下的钱数是甲剩下的2倍，\n那么甲原有多少钱",total,this.m_number.y)

        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20)

        this.m_pipeline.make_vertical_line(480,20,480).attach_to(this)

        this.analyze_panel = new Container();
        this.analyze_panel.x = 500
        this.analyze_panel.y = 20
        this.addChild(this.analyze_panel)

        this.m_segment_initializers.push({
            begin_point:{x:this.m_number.x,y:20},
            scale : 3,
            segments : [{
                width:this.m_number.a
            }]
        },{
            begin_point:{x:this.m_number.x,y:20},
            scale : 3,
            segments : [{
                width:this.m_number.a
            },{
                width:this.m_number.a
            }]
        },{
            begin_point:{x:this.m_number.x,y:20},
            scale : 3,
            segments : [{
                width:this.m_number.y
            }]
        })
    }

    private answer_0(){
        const text = "解"
        this.m_pipeline.make_text(text).attach_to(this.analyze_panel).set_position(0,20)
    }
    private answer_1(){
        this.m_pipeline.make_text("甲：").attach_to(this.analyze_panel).set_position(0,60)
        this.m_pipeline.make_horiaontal_segment(this.m_segment_initializers[0]!).attach_to(this.analyze_panel).set_position(60,60).tag("answer.1.segment")

        this.m_pipeline.make_text("乙：").attach_to(this.analyze_panel).set_position(0,120)
        this.m_pipeline.make_horiaontal_segment(this.m_segment_initializers[1]!).attach_to(this.analyze_panel).set_position(60,120).tag("answer.2.segment")

        this.m_pipeline.make_text("丙：").attach_to(this.analyze_panel).set_position(0,180)
        this.m_pipeline.make_horiaontal_segment(this.m_segment_initializers[2]!).attach_to(this.analyze_panel).set_position(60,180).tag("answer.3.segment")

    }

    private answer_2(){
        this.m_segment_initializers[2]!.segments[0]!.tip = this.m_number.y + ""
        this.m_pipeline.redraw("answer.3.segment")
    }
     

    private answer_3(){


        HorizontalSegmentOperator.insert(0,{width:this.m_number.x},this.m_segment_initializers[0]!)
        this.m_segment_initializers[0]!.begin_point.x -= this.m_number.x;
        this.m_segment_initializers[0]!.segments[0]!.color = "yellow"
        
        HorizontalSegmentOperator.insert(0,{width:this.m_number.x},this.m_segment_initializers[1]!)
        this.m_segment_initializers[1]!.begin_point.x -= this.m_number.x;
        this.m_segment_initializers[1]!.segments[0]!.color = "yellow"

        HorizontalSegmentOperator.insert(0,{width:this.m_number.x},this.m_segment_initializers[2]!)
        this.m_segment_initializers[2]!.begin_point.x -= this.m_number.x;
        this.m_segment_initializers[2]!.segments[0]!.color = "yellow"

        // 花了相同的钱，这里补上

        this.m_pipeline.make_text("1.花了相同的钱").attach_to(this.analyze_panel).set_position(30,240).tag("answer.3.tip");
        this.m_pipeline.redraw("answer.1.segment","answer.2.segment","answer.3.segment")

    }
    private answer_4(){
       // 总长度
       const total = 3 * (this.m_number.x + this.m_number.a) + this.m_number.y;
       const tip = string_format("2.三条线总长度 {0}",total + "");
       this.m_pipeline.make_text(tip).attach_to(this.analyze_panel).set_position(30,280).tag("answer.4.tip");
    }
    private answer_5(){
        
        HorizontalSegmentOperator.remove(1,this.m_segment_initializers[2]!)
        this.m_pipeline.redraw("answer.3.segment")

        const total = 3 * ( this.m_number.a + this.m_number.x) + this.m_number.y;
        const tip = string_format("3. 移除掉已知的长度，三条线总长度总长度 变成 {0} - {1}",total + "",this.m_number.y + "");
        this.m_pipeline.make_text(tip).attach_to(this.analyze_panel).set_position(30,320).tag("answer.5.tip");
    }

    // [0,x] [ x ,a] => [0,x,a]
    // [0,x] [x ,a ] [a,a + a - x] => [0,x,a,aa-2]
    // [0,x] [x ,y] => [0,x,x+y]
    // t = 3 * a + y

    private answer_6(){

        const initializer : HorizontalSegmentInitializer = {
            begin_point : {x : this.m_number.a + this.m_number.x ,y : 20},
            segments : [{
                width : this.m_number.a
            }]
        }
        this.m_pipeline.make_horiaontal_segment(initializer).attach_to(this.analyze_panel).set_position(0,120).move_to(0,180);

        
    }
    private refresh_answer_6(){
        HorizontalSegmentOperator.remove(2,this.m_segment_initializers[1]!)
        HorizontalSegmentOperator.insert(1,{width : this.m_number.a},this.m_segment_initializers[2]!);
        
        this.m_pipeline.redraw("answer.2.segment","answer.3.segment")

        const total = 3 * ( this.m_number.a + this.m_number.x) + this.m_number.y;
        const tip = string_format("4.三个数平均是：({0} - {1}) / 3 = {2}",total,this.m_number.y,this.m_number.a);
        this.m_pipeline.make_text(tip).attach_to(this.analyze_panel).set_position(30,360).tag("answer.6.tip");

        let arrow_initializer = { } as ArrowInitializer
        this.m_pipeline.make_arrow("answer.2.segment","answer.3.segment",this.analyze_panel!,arrow_initializer).tag("answer.6.arrow");
    }
    private answer_7(){
        
    }
}

class Controller extends QuestionController{
    constructor() {
        super();
        this.question_templates.push({
            template : Question_1,
            title : "简单和倍",
        });
    }
};


export const APP_Math_5_13 : QuestionTableItem = {
    category: "奥数",
    title: "和倍问题",
    creator: ()=> new Controller()
}