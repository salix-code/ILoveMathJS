import { Container } from "pixi.js";
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";

function string_format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => args[index]);
}

class Question_1 extends QuestionView{
    private analyze_panel:Container | null = null;

    constructor(){
        super("")
        this.draw_answer_function = [
            this.answer_0.bind(this),
            this.answer_1.bind(this),

        ]
        this.regenerate()

        
    }
    public regenerate(): void {
        let text = string_format("三个小朋友一共有222，\n每人花去相同的钱后，\n甲还剩下12元钱，\n乙剩下的钱数是丙剩下的2倍，\n那么丙原有多少钱")

        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20)

        this.m_pipeline.make_vertical_line(500,20,500).attach_to(this)

        this.analyze_panel = new Container();
        this.analyze_panel.x = 500
        this.analyze_panel.y = 20
        this.addChild(this.analyze_panel)

    }

    private answer_0(){
        const text = "解"
        this.m_pipeline.make_text(text).attach_to(this.analyze_panel).set_position(0,20)
    }
    private answer_1(){
        this.m_pipeline.make_text("甲").attach_to(this.analyze_panel).set_position(0,40)
        this.m_pipeline.make_segment([]).attach_to(this.analyze_panel).set_position(20,40)

        this.m_pipeline.make_text("乙").attach_to(this.analyze_panel).set_position(0,40)
        this.m_pipeline.make_segment([]).attach_to(this.analyze_panel).set_position(20,40)

        this.m_pipeline.make_text("丙").attach_to(this.analyze_panel).set_position(0,40)
        this.m_pipeline.make_segment([]).attach_to(this.analyze_panel).set_position(20,40)

        const segmet = this.m_pipeline.get_view_by_tag("answer");
        segmet.insert(0,[]);
        segmet.append([]);

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