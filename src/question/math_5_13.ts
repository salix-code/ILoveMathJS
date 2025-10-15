import { Container } from "pixi.js";
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
import type { HorizontalSegmentOptions } from "../component/segment";
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
    private m_segment_options : HorizontalSegmentOptions[] = []
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
    // [0,x] [ x ,a]
    // [0,x] [x ,a,a + a - x ]
    // [0,x] [x ,y]
    // t = 3 * a + y
    public regenerate(): void {

        this.m_number.a =70;
        this.m_number.x = 8;
        this.m_number.y = 12;
        const total = this.m_number.a * 3 + this.m_number.y;
        const text = string_format("三个小朋友一共有{0}，\n每人花去相同的钱后，\n丙还剩下{1}元钱，\n乙剩下的钱数是甲剩下的2倍，\n那么甲原有多少钱",total,this.m_number.y)

        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20)

        this.m_pipeline.make_vertical_line(500,20,500).attach_to(this)

        this.analyze_panel = new Container();
        this.analyze_panel.x = 500
        this.analyze_panel.y = 20
        this.addChild(this.analyze_panel)

        this.m_segment_options.push({
            point_x: [this.m_number.x, this.m_number.a],
            point_y: 20,
            segment_color: new Map(),
            tip_options : new Map(),
        },{
            point_x: [this.m_number.x,this.m_number.a,this.m_number.a * 2 - this.m_number.x],
            point_y: 20,
            segment_color: new Map(),
            tip_options : new Map(),
        },{
            point_x: [this.m_number.x,this.m_number.y],
            point_y: 20,
            segment_color: new Map(),
            tip_options : new Map(),
        })

    }

    private answer_0(){
        const text = "解"
        this.m_pipeline.make_text(text).attach_to(this.analyze_panel).set_position(0,20)
    }
    private answer_1(){
        this.m_pipeline.make_text("甲：").attach_to(this.analyze_panel).set_position(0,40)
        this.m_pipeline.make_horiaontal_segment(this.m_segment_options[0]!).attach_to(this.analyze_panel).set_position(20,40).tag("answer.1.segment")

        this.m_pipeline.make_text("乙：").attach_to(this.analyze_panel).set_position(0,40)
        this.m_pipeline.make_horiaontal_segment(this.m_segment_options[1]!).attach_to(this.analyze_panel).set_position(20,40).tag("answer.2.segment")

        this.m_pipeline.make_text("丙：").attach_to(this.analyze_panel).set_position(0,40)
        this.m_pipeline.make_horiaontal_segment(this.m_segment_options[2]!).attach_to(this.analyze_panel).set_position(20,40).tag("answer.3.segment")

    }

    private answer_2(){
        this.m_segment_options[this.m_segment_options.length - 1]!.tip_options?.set(0,{text : this.m_number.y + ""})
    }
     

    private answer_3(){
        // 花了相同的钱，这里补上
        this.m_segment_options[0]!.point_x.unshift(0);
        this.m_segment_options[1]!.point_x.unshift(0);
        this.m_segment_options[2]!.point_x.unshift(0);
        
        this.m_segment_options[0]!.segment_color.set(1,"red")
        this.m_segment_options[1]!.segment_color.set(1,"red")
        this.m_segment_options[2]!.segment_color.set(1,"red")

        this.m_pipeline.make_text("花了相同的钱").attach_to(this.analyze_panel).set_position(0,0).tag("answer.2.tip");
        this.m_pipeline.redraw("answer.1.segment","answer.2.segment","answer.3.segment")

    }
    private answer_4(){
       // 总长度
       const total = 3 * this.m_number.a + this.m_number.y;
       const tip = string_format("三条线总长度{0}",total + "");
       this.m_pipeline.make_text(tip).attach_to(this.analyze_panel).set_position(100,20).tag("answer.4.tip");
    }
    private answer_5(){
        // 把已知的长度移到总和-多少这里

        this.m_segment_options[2]?.point_x.slice(1,1);       
        this.m_pipeline.redraw("answer.5.segment")

        const label = this.m_pipeline.get_view_by_tag("answer.5.tip") as Text;
        const total = 3 * this.m_number.a + this.m_number.y;
        label.text = string_format("总长度{0} - {1}",total + "",this.m_number.y + "");
    }

    // [0,x] [ x ,a] => [0,x,a]
    // [0,x] [x ,a ] [a,a + a - x] => [0,x,a,aa-2]
    // [0,x] [x ,y] => [0,x,y]
    // t = 3 * a + y

    private answer_6(){
        // 把某一个多的线段移到少的，

        this.m_segment_options[1]?.point_x.slice(2);
        this.m_segment_options[2]?.point_x.push(this.m_number.a);
        this.m_segment_options[2]?.segment_color.set(1,'red');

        this.m_pipeline.redraw("answer.2.segment","answer.3.segment")

        const label = this.m_pipeline.get_view_by_tag("answer.5.tip") as Text;

        label.text = string_format("三个数平均是：{0}",0);

        let arrow_initializer = { } as ArrowInitializer
        this.m_pipeline.make_arrow("answer.2.segment","answer.3.segment",this.analyze_panel,arrow_initializer).tag("answer.6.arrow");

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