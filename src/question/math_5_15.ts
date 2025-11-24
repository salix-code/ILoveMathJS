import * as PIXI from 'pixi.js';
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
import { SegmentRender, TextRender, type TextRenderItem } from '../actions/rendersystem';
import { CircleDefinition, CircleRender } from '../actions/circlesystem';
import { CurlyDefinition, CurlyRender } from '../actions/curlyrender';
//import { RenderSystem } from '../actions/rendersystem';

function string_format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => String(args[index]));
}
class MathView extends QuestionView {
    protected m_textPanel: PIXI.Container | null = null;
    protected m_graphics: PIXI.Graphics | null = null;

    protected m_textRender: TextRender | null = null;
    protected m_circleRender: CircleRender | null = null;

    protected m_textItem: TextRenderItem[] = [];
    protected m_circle: CircleDefinition;

    protected m_curlyRender: CurlyRender;
    protected m_curlyData: CurlyDefinition = new CurlyDefinition();

    //protected m_render : RenderSystem | null = null;
    constructor() {
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

        if (this.m_textPanel) {
            this.m_textRender = new TextRender(this.m_textPanel, this.m_textItem)
        }
        this.m_circle = new CircleDefinition();
        if (this.m_graphics && this.m_circle) {
            this.m_circleRender = new CircleRender(this.m_circle, this.m_graphics);
        }

        this.m_curlyRender = new CurlyRender(this.m_curlyData, this, 100, 160);
    }
    public clean(): void {
        super.clean();
        if (this.m_graphics) {
            this.m_graphics.clear();
        }
        if (this.m_textPanel) {
            this.m_textPanel.removeChildren();
        }
    }

    public redraw() {

    }
    public requestUpdate(tag: string) {
        if (tag == "graph") {


        }
    }
}

class Question_1 extends MathView {
    private m_number: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 };
    constructor() {
        super();

        this.draw_answer_function = [
            this.answer_1.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
            this.answer_4.bind(this),
        ];
        this.regenerate();
    }
    public regenerate(): void {
        this.clean();
        this.m_circle.Empty();
        this.m_curlyData.Empty();
        this.m_textItem.splice(0, this.m_textItem.length);

        this.m_curlyRender.redraw();

        this.m_number.x = Math.floor(Math.random() * 3) + 3;
        this.m_number.y = Math.floor(Math.random() * 5) + 1;
        const a = (this.m_number.x + this.m_number.y)
        this.m_number.z = a * (Math.floor(Math.random() * 5) + 2) + Math.floor(Math.random() * a);

        const text = string_format(`有{0}个红灯，{1}个绿灯排印，问第{2}个灯是什么颜色?`, this.m_number.x, this.m_number.y, this.m_number.z);

        this.m_pipeline.make_text(text).attach_to(this).set_position(100, 80);

        for (let i = 0; i < this.m_number.x; ++i) {

            this.m_circle.Add({
                x: 30 + i * 40,
                y: 100,
                r: 15,
                fill: true,
                color: "red",
            })
        }

        for (let i = 0; i < this.m_number.y; ++i) {
            this.m_circle.Add({
                x: 30 + (i + this.m_number.x) * 40,
                y: 100,
                r: 15,
                fill: true,
                color: "green",
            })
        }




        for (let i = 0; i < this.m_number.x / 2; ++i) {
            this.m_circle.Add({
                x: 30 + (i + this.m_number.x + this.m_number.y) * 40,
                y: 100,
                r: 15,
                fill: true,
                color: "red",
            })
        }

        this.m_circleRender?.redraw();
    }
    private answer_1() {
        const circleBeginIndex = this.m_number.x + this.m_number.y;
        for (let i = circleBeginIndex; i < this.m_circle.Array().length; ++i) {
            const item = this.m_circle.Get(i);
            if (item) {
                item.x += 30;
            }
        }
        this.m_circleRender?.redraw();
    }
    private answer_2() {
        const a = this.m_number.x + this.m_number.y;
        this.m_curlyData.Add({
            x1: 30,
            y1: 100 - 20,
            x2: 30 + ((a - 1) * 40),
            y2: 100 - 20,
            height: 8,
            text: "一个周期",
            color: "yellow",
        });
        this.m_curlyRender.redraw();
    }
    private answer_3() {
        const text = "计算组数与余数：\n" + string_format("{0} ÷ {1} = {2} …… {3}", this.m_number.z, this.m_number.x + this.m_number.y, Math.floor(this.m_number.z / (this.m_number.x + this.m_number.y)), this.m_number.z % (this.m_number.x + this.m_number.y));
        this.m_textItem.push({
            text: text,
            x: 100,
            y: 250
        });
        this.m_textRender?.redraw();
    }

    private answer_4() {


        const m = this.m_number.z % (this.m_number.x + this.m_number.y);
        const left = this.m_number.x + this.m_number.y;

        this.m_circle.RemoveLength(left, this.m_circle.Array().length - left);
        const begin_x = 30 + (this.m_number.x + this.m_number.y) * 40 + 50;

        for (let i = 0; i < Math.max(this.m_number.x / 2, m); ++i) {
            this.m_circle.Add({
                x: begin_x + i * 40,
                y: 100,
                r: 16,
                fill: true,
                color: i < this.m_number.x ? "red" : "green",
            });
        }


        if (m > 0) {
            this.m_textItem.push({
                text: string_format("余{0}，说明是第{1}个灯", m, m),
                x: begin_x,
                y: 160,
                fontsize: 16,
            });

            for (let i = 0; i < m; ++i) {
                this.m_textItem.push({
                    text: (i + 1) + "",
                    x: begin_x + 8 + i * 40,
                    y: 125,
                    fontsize: 16,
                });
            }
        } else {
            this.m_textItem.push({
                text: "余0，说明是一个周期的最后一个",
                x: 30,
                y: 180,
                fontsize: 16,
            });

            this.m_textItem.push({
                text: "0",
                x: 25 + (this.m_number.x + this.m_number.y - 1) * 40,
                y: 125,
                fontsize: 16,
            });

        }


        this.m_textRender?.redraw();
        this.m_circleRender?.redraw();
    }
}

class Question_2 extends MathView {
    constructor() {
        super();
    }

    public regenerate(): void {

    }
}

class Question_3 extends MathView {

}


class Question_4 extends MathView {

}



class Controller extends QuestionController {
    constructor() {
        super();
        this.question_templates.push({
            template: Question_1,
            title: "周期问题 - 1",
        }, {
            template: Question_2,
            title: "周期问题 - 2",
        }, {
            template: Question_3,
            title: "周期问题 - 3",
        }, {
            template: Question_4,
            title: "周期问题 - 4",
        });
    }
};


export const APP_Math_5_15: QuestionTableItem = {
    category: "奥数",
    title: "周期问题",
    creator: () => new Controller()
}