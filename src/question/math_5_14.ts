import { Container, createLevelBuffersFromKTX, createStringVariations } from "pixi.js";
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
import { HorizontalSegmentOperator, type HorizontalSegmentInitializer } from "../component/segment";
import { DelayManager } from "../actions/delaymanager";
import { CreateQuestionGraphConstructor, type EllipseDesc, type QuestionGraphConstructor, type TextDesc } from "../component/questionngraph";
import type { VerticalListTextInitializer } from "../component/listtext";

function string_format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => String(args[index]));
}


class Question_1 extends QuestionView {
    private analyze_panel: Container | null = null;
    private tip_panel: Container | null = null;
    private m_number: { a: number, x: number } = { a: 0, x: 0 };
    private m_segment_initializer: HorizontalSegmentInitializer[] = []
    private m_name: string[] = ["排球", "足球"];
    constructor() {
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

        const question_text = string_format(question_array[question_index]!, this.m_number.a, this.m_number.x * (this.m_number.a - 1));
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
        this.m_pipeline.make_horiaontal_line(0, 0, 1024).set_position(80, 120).attach_to(this);
        this.analyze_panel = new Container();
        this.analyze_panel.x = 100;
        this.analyze_panel.y = 125;
        this.addChild(this.analyze_panel);

        this.tip_panel = new Container();
        this.tip_panel.x = 800;
        this.tip_panel.y = 125;
        this.addChild(this.tip_panel);

        this.m_segment_initializer = [{
            begin_point: { x: 0, y: 20 },
            scale: 1,
            segments: [],
            length_tip: []
        }, {
            begin_point: { x: 0, y: 20 },
            scale: 1,
            segments: [],
            length_tip: []
        },
        ]

    }

    private answer_1() {
        this.m_pipeline.make_text(this.m_name[0]!).set_position(10, 40).attach_to(this.analyze_panel);
        this.m_pipeline.make_horiaontal_segment(this.m_segment_initializer[0]!).set_position(100, 40).attach_to(this.analyze_panel).tag("answer.1.segment")

        DelayManager.getInstance().create().delay(() => {
            this.m_pipeline.make_text("1. 已知最小的球是排球，先画出线", 14).attach_to(this.tip_panel).set_position(0, 40);
        }, 1).delay(() => {
            this.m_segment_initializer[0]?.segments.push({ width: 60, tip: "" });
            this.m_pipeline.redraw("answer.1.segment")
        }, 1).delay(() => {
            this.m_segment_initializer[0]!.segments[0]!.tip = "1";
            this.m_pipeline.redraw("answer.1.segment")
        })


    }

    private answer_2() {
        this.m_pipeline.make_text(this.m_name[1]!).set_position(10, 100).attach_to(this.analyze_panel);

        this.m_pipeline.make_horiaontal_segment(this.m_segment_initializer[1]!).set_position(100, 100).attach_to(this.analyze_panel).tag("answer.2.segment");

        DelayManager.getInstance().create().delay(() => { }, 1).delay(() => {
            const num = this.m_segment_initializer[1]?.segments.length!;
            this.m_segment_initializer[1]?.segments.push({ width: 60, tip: (num + 1) + '' });
            this.m_pipeline.redraw("answer.2.segment")
        }, 1, this.m_number.a)

        this.m_pipeline.make_text("2. 根据排球，画出足球的数量表示", 14).attach_to(this.tip_panel).set_position(0, 80);
    }

    private answer_3() {

        DelayManager.getInstance().create()
            .delay(() => { }, 1)
            .delay((loop_counter: number) => {
                const segment = this.m_segment_initializer[1]?.segments[1 + loop_counter];
                if (segment) {
                    segment.color = "red";
                }
                this.m_pipeline.redraw("answer.2.segment");

            }, 1, this.m_number.a - 1)
            .delay(() => { }, 2)
            .delay(() => {
                this.m_pipeline.make_text("3.足球比排球多，多多少，是多几份", 14).attach_to(this.tip_panel).set_position(0, 120);
            }, 0.3)
            .delay(() => {

            });
    }

    private answer_4() {

        HorizontalSegmentOperator.hide(0, this.m_segment_initializer[0]!);
        HorizontalSegmentOperator.hide(0, this.m_segment_initializer[1]!);
        const length_tip = string_format("多{0}个，共{1}份", this.m_number.x * (this.m_number.a - 1), this.m_number.a - 1);

        this.m_segment_initializer[1]?.length_tip?.push({ range: [1, this.m_number.a - 1], text: length_tip });
        this.m_pipeline.redraw("answer.1.segment", "answer.2.segment");

        this.m_pipeline.make_text("4. 求出每一份的长度后，是不是就可以求出球的数量了。", 14).attach_to(this.tip_panel).set_position(0, 160);
    }

    private answer_5() {
        const n = this.m_number.a - 1
        const m = this.m_number.x * n
        const text = string_format("最后求出一份的数据是：{0} ÷ {1} = {2}", m, n, this.m_number.x)
        this.m_pipeline.make_text(text, 32).attach_to(this.analyze_panel).set_position(120, 240);
    }
}


class Question_5_14 extends QuestionView {
    protected m_question!: QuestionGraphConstructor;
    protected m_tip: VerticalListTextInitializer = { items: [] } as VerticalListTextInitializer;
    protected analyze_panel: Container | null = null;
    protected tip_panel: Container | null = null;

    constructor() {
        super("");

    }
    public clean(): void {
        super.clean();
    }

}


class Question_2 extends Question_5_14 {
    private m_number: { x: number, y: number, n: number, a: number } = { x: 0, y: 0, n: 0, a: 0 }
    private m_segment_width: number = 0;
    private m_segment_scale: number = 1;
    private m_first_segment_y: number = 80;
    private m_seconnd_segment_y: number = 200;
    private m_begin_x: number = 0;
   
    constructor() {
        super()

        this.draw_answer_function = [
            this.answer_0.bind(this),
            this.answer_1.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
            this.answer_4.bind(this),
            this.answer_5.bind(this),
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

        this.m_number.y = Math.floor(Math.random() * 10 + 20) + this.m_number.a;
        this.m_number.x = (this.m_number.y - this.m_number.a) * this.m_number.n + this.m_number.a

        this.m_segment_width = 100;
        this.m_segment_scale = 100 / (this.m_number.y - this.m_number.a);

        this.m_begin_x = 60;

        this.m_question = CreateQuestionGraphConstructor();

        this.m_question.segment.push({points:[],dash : true},{points:[],dash : true});

        const question_index = Math.floor(Math.random() * question_array.length);
        const question_text = string_format(question_array[question_index]!, this.m_number.x, this.m_number.y, this.m_number.n);
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
        this.m_pipeline.make_horiaontal_line(0, 0, 1024).set_position(80, 160).attach_to(this);

        this.analyze_panel = new Container();
        this.analyze_panel.x = 100;
        this.analyze_panel.y = 160;
        this.addChild(this.analyze_panel);

        this.tip_panel = new Container();
        this.tip_panel.x = 800;
        this.tip_panel.y = 160;
        this.addChild(this.tip_panel);



    }
    private answer_0() {
        const begin_x = Math.floor(this.m_number.a * this.m_segment_scale) + this.m_begin_x;
        this.m_question.segment[0]!.points.push([begin_x, this.m_first_segment_y], [begin_x + this.m_segment_width, this.m_first_segment_y]);
        this.m_question.segment[1]!.points.push([begin_x, this.m_seconnd_segment_y])
        for (let i = 1; i < this.m_number.n + 1; ++i) {
            this.m_question.segment[1]!.points.push([begin_x + i * this.m_segment_width, this.m_seconnd_segment_y])
        }

        this.m_question.curly = [{
            x1: begin_x,
            y1: this.m_first_segment_y - 12,
            x2: begin_x + this.m_segment_width,
            y2: this.m_first_segment_y - 12,
            text: "1份",
            height: 8
        }, {
            x1: begin_x,
            y1: this.m_seconnd_segment_y - 12,
            x2: this.m_question.segment[1]!.points[this.m_number.n]![0],
            y2: this.m_seconnd_segment_y - 12,
            text: string_format("{0}份", this.m_number.n),
            height: 8
        }
        ];

        this.m_tip = { items: [{ text: string_format("画出比例关系==> 1 比 {0}", this.m_number.n) }] };
        this.m_pipeline.make_question_graph(this.m_question).attach_to(this.analyze_panel).set_position(10, 10).tag("question_graph");
        this.m_pipeline.make_vertical_text(this.m_tip).attach_to(this.tip_panel).set_position(0, 30).tag("tip_vertical")
    }
    private pushTipText(text: string) {
        this.m_tip.items.push({ text: text });
        this.requestUpdate("tip_vertical");

    }
    private answer_1() {
        // const begin_x = this.m_begin_x
        const points = this.m_question.segment[1]?.points!;

        this.m_question.curly!.push({
            x1: points[1]![0],
            y1: points[1]![1] + 12,
            x2: points[points.length - 1]![0],
            y2: points[1]![1] + 12,
            text: string_format("多{0}份", this.m_number.n - 1),
            height: -8,
            textOffset: [0, 0]
        });

        this.pushTipText(string_format("画出多出的 {0}份", this.m_number.n - 1))

        this.requestUpdate("question_graph");

    }
    private answer_2() {

        this.m_question.segment[0]!.points.splice(0, 0, [this.m_begin_x, this.m_first_segment_y])
        this.m_question.segment[1]!.points.splice(0, 0, [this.m_begin_x, this.m_seconnd_segment_y])

        this.m_tip.items.push({ text: string_format("补上去掉的数量") });
        this.requestUpdate("question_graph", "tip_vertical");

        DelayManager.getInstance().create().delay(() => {
            const curly = this.m_question.curly!;

            curly[0]!.x1 = this.m_begin_x
            curly[1]!.x1 = this.m_begin_x

            curly[0]!.text = string_format("{0}", this.m_number.y);
            curly[1]!.text = string_format("{0}", this.m_number.x);

            this.requestUpdate("question_graph");

        }, 30);

    }
    private answer_3() {
        //const width = Math.floor(this.m_segment_width * (this.m_number.y - this.m_number.a) / this.m_number.a)

        const point_1 = this.m_question.segment[0]!.points[0]
        const point_2 = this.m_question.segment[1]!.points[0]
        const point_3 = this.m_question.segment[0]!.points[2]!
        const point_4 = this.m_question.segment[1]!.points[2]!


        this.m_question.segment.push(
            { points: [[point_3[0], point_3[1] - 50], [point_4[0], point_4[1] + 50]], color: 'red', type: 1, dash: false }
        );

        //this.m_question.text![0]!.text = "="
        //this.m_question.text![0]!.x = (point_1![0] + point_3![0]) / 2

        this.requestUpdate("question_graph", "tip_vertical");

    }
    private answer_4() {
        DelayManager.getInstance().create().delay(() => {
            if (this.m_question.curly![2]!.textOffset) {
                this.m_question.curly![2]!.textOffset[0] = -40
                this.requestUpdate("question_graph")
            }
        }, 1).delay(() => { }, 5)
            .delay(() => {
                if (this.m_question.curly![2]) {
                    this.m_question.curly![2].text = string_format("多{0}份 = {1} - {2}", this.m_number.a, this.m_number.x, this.m_number.y);
                    this.requestUpdate("question_graph")
                }
            }, 1).delay(() => {
                const result = this.m_number.y - this.m_number.a;
                const txt = string_format("计算出一份的数量为 ({0} - {1}) ÷ {2} = {3}", this.m_number.x, this.m_number.y, this.m_number.a, result);
                this.m_tip.items.push({ text: txt },);
                this.requestUpdate("tip_vertical");
            }, 1);

    }

    private answer_5() {
        this.m_tip.items.push({ text: string_format("计算出最后的结果") });
        this.requestUpdate("tip_vertical");

        this.m_question.segment.splice(2, 1);

        const result = this.m_number.y - this.m_number.a;
        DelayManager.getInstance().create().delay(() => { }, 2)
            .delay(() => {
                const curly = this.m_question.curly
                const segment = this.m_question.segment[0];

                if (curly && curly[0] && segment && segment.points[1]) {
                    curly[0].x1 = segment.points[1][0]
                    curly[0].text = string_format("1份 = {0}", result);
                    curly[0].textColor = 'red'
                }

                this.requestUpdate("question_graph")
            }, 2)
            .delay(() => {
                const curly = this.m_question.curly
                const segment = this.m_question.segment[1];

                if (curly && curly[1] && segment && segment.points[1]) {
                    curly[1].x1 = segment.points[1][0]
                    curly[1].text = string_format("{0}份 == {0} X {1}", this.m_number.n, result);
                    curly[1].textColor = 'red'
                    this.requestUpdate("question_graph")
                }

            }, 1).delay(() => {
                const curly = this.m_question.curly;
                if (curly) {
                    curly.splice(2, 1);
                    this.requestUpdate("question_graph")
                }
            });

    }
}



class Question_3 extends Question_5_14 {
    private m_number: { x: number, y: number, n: number, a: number } = { x: 0, y: 0, a: 0, n: 0 };
    private m_segment_y: [number, number] = [100, 200];
    private m_segment_start_x: number = 40;
    private m_segment_width: number = 100;
    constructor() {
        super();
        this.draw_answer_function = [
            this.answer_0.bind(this),
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
        this.m_question = CreateQuestionGraphConstructor();

        this.analyze_panel = new Container();
        this.analyze_panel.x = 100;
        this.analyze_panel.y = 160;
        this.addChild(this.analyze_panel);

        this.tip_panel = new Container();
        this.tip_panel.x = 800;
        this.tip_panel.y = 160;
        this.addChild(this.tip_panel);

        const question_array = [
            "有甲，乙两个人，甲今年{0}岁，乙今年{1}岁，再过多少年甲的年龄正好是乙的{2}倍",
        ];
        // x + a = n (y + a)
        // x + a = n * t
        // = > x + a = n * t
        // a + x % n == 0
        // a <  x /n - 1
        this.m_number.n = Math.floor(Math.random() * 5 + 2);

        // nt = a + x;
        // 3/n <= t <= 100/n
        // 
        const x1 = Math.max(Math.ceil(3 / this.m_number.n), 3) // 1;
        const x2 = Math.floor(100 / this.m_number.n)
        const t = Math.floor(Math.random() * (x2 - x1)) + x1;
        // 
        this.m_number.y = Math.floor(Math.random() * (0.6 * t) + 0.2 * t);

        this.m_number.a = t - this.m_number.y
        this.m_number.x = t * this.m_number.n - this.m_number.a;


        const question_index = Math.floor(Math.random() * question_array.length);
        const question_text = string_format(question_array[question_index]!, this.m_number.x, this.m_number.y, this.m_number.n);
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
        this.m_pipeline.make_horiaontal_line(0, 0, 1024).set_position(80, 160).attach_to(this);

    }

    private answer_0() {
        let segmet = this.m_question.segment;


        const startX = this.m_segment_start_x;

        segmet.push({ points: [[startX, this.m_segment_y[0]], [startX + this.m_segment_width, this.m_segment_y[0]]] });
        segmet.push({ points: [] });
        if (segmet[1] && segmet[1].points) {
            for (let i = 0; i < this.m_number.n + 1; ++i) {
                segmet[1].points.push([i * this.m_segment_width + startX, this.m_segment_y[1]]);
            }
        }

        if (this.m_question.text) {
            this.m_question.text.push({
                text: "甲", x: 0, y: this.m_segment_y[1] - 10
            }, {
                text: "乙", x: 0, y: this.m_segment_y[0] - 10
            }, {
                text: "未来", x: startX, y: 10
            });
        }

        this.m_pipeline.make_question_graph(this.m_question).attach_to(this.analyze_panel).set_position(10, 10).tag("question_graph");
    }

    private answer_1() {

        const curly = this.m_question.curly;
        if (!curly) {
            return;
        }
        let segment = this.m_question.segment[0];
        if (segment && segment.points[0] && segment.points[1]) {
            curly.push({
                x1: segment.points[0][0],
                y1: segment.points[0][1] - 12,
                x2: segment.points[1][0],
                y2: segment.points[1][1] - 12,
                text: "1份",
                height: 8
            });
        }
        segment = this.m_question.segment[1];
        if (segment && segment.points[0] && segment.points[1] && segment.points[this.m_number.n]) {
            curly.push({
                x1: segment.points[0][0],
                y1: segment.points[0][1] - 12,
                x2: segment.points[this.m_number.n]![0],
                y2: segment.points[this.m_number.n]![1] - 12,
                text: string_format("{0}份", this.m_number.n),
                height: 8
            });

            curly.push({
                x1: segment.points[1][0],
                y1: segment.points[1][1] + 12,
                x2: segment.points[this.m_number.n]![0],
                y2: segment.points[this.m_number.n]![1] + 12,
                text: string_format("多{0}份", this.m_number.n - 1),
                height: -12
            });

        }



        this.requestUpdate("question_graph");
    }

    private answer_2() {
        const width = Math.floor(this.m_number.a / (this.m_number.y + this.m_number.a) * this.m_segment_width);
        const startX = this.m_segment_start_x;


        for (let i = 0; i < 2; ++i) {
            let segment = this.m_question.segment[i];
            if (segment) {
                segment.points.splice(0, 1, [this.m_segment_start_x + width, this.m_segment_y[i]!]);
            }
            this.m_question.segment.push({
                points: [[this.m_segment_start_x, this.m_segment_y[i]!], [this.m_segment_start_x + width, this.m_segment_y[i]!]],
                type: 1,
                dash: false,
                color: "yellow"
            });
        }

        {

            this.m_question.segment.push({
                points: [[startX, this.m_segment_y[0] - 60], [startX, this.m_segment_y[1] + 60]],
                type: 1,
                dash: false,
                color: "red",
            });

            if (this.m_question.segment[0] && this.m_question.segment[1]) {
                if (this.m_question.segment[0].points[0] && this.m_question.segment[1].points[0]) {
                    const x = this.m_question.segment[0].points[0][0];
                    const y: [number, number] = [0, 0];
                    y[0] = this.m_segment_y[0];
                    y[1] = this.m_segment_y[1];
                    this.m_question.segment.push({
                        points: [[x, y[0] - 60], [x, y[1] + 60]],
                        type: 1,
                        dash: false,
                        color: "red",
                    });
                }
            }
        }
        if (this.m_question.curly) {
            this.m_question.curly.splice(0, 2);
        }

        this.m_question.text?.push({
            text: "多少年",
            x: this.m_segment_start_x,
            y: this.m_segment_y[1] + 40,
            fontSize: 16,
        });


        this.requestUpdate("question_graph");
    }
    private answer_3() {
        if (this.m_question.segment[0]) {
            let point = this.m_question.segment[0].points[0];
            if (point && this.m_question.text) {
                this.m_question.text.push({
                    text: "现在",
                    x: point[0],
                    y: 10,
                })
            }
        }
        let curly = this.m_question.curly;
        if (curly) {
            let segment = this.m_question.segment[0];
            if (segment && segment.points[0] && segment.points[1]) {
                curly.push({
                    x1: segment.points[0][0],
                    y1: this.m_segment_y[0] - 12,
                    x2: segment.points[1][0],
                    y2: this.m_segment_y[0] - 12,
                    height: 8,
                    text: string_format("{0}岁", this.m_number.y)
                })

            }
            segment = this.m_question.segment[1];
            if (segment && segment.points[0] && segment.points[this.m_number.n]) {
                curly.push({
                    x1: segment.points[0][0],
                    y1: this.m_segment_y[1] - 12,
                    x2: segment.points[this.m_number.n]![0],
                    y2: this.m_segment_y[1] - 12,
                    height: 8,
                    text: string_format("{0}岁", this.m_number.x),
                    color: "red"
                });
            }

            if (curly[0]) {
                curly[0].text = string_format("多{0}份  =  {1} - {2} ", this.m_number.n - 1, this.m_number.x, this.m_number.y)
            }
        }

        this.requestUpdate("question_graph");
    }

    private answer_4() {
        let curly = this.m_question.curly
        let segment = this.m_question.segment[0]
        if (curly && segment && segment.points[1]) {
            curly.push({
                x1: this.m_segment_start_x,
                y1: segment.points[1][1] + 12,
                x2: segment.points[1][0],
                y2: segment.points[1][1] + 12,
                height: -8,
                text: string_format("1份 = {0}", (this.m_number.y + this.m_number.a))
            })
        }

        this.m_question.segment.splice(4, 2);
        if (this.m_question.text) {
            this.m_question.text.splice(3, 1);
        }
        this.requestUpdate("question_graph");
    }

    private answer_5() {

        let curly = this.m_question.curly
        let segment = this.m_question.segment[0]
        if (curly && segment && segment.points[0]) {
            curly.push({
                x1: this.m_segment_start_x,
                y1: segment.points[0][1] - 12,
                x2: segment.points[0][0],
                y2: segment.points[0][1] - 12,
                height: 8,
                text: string_format("{0}岁", (this.m_number.a)),
                textColor: "red"
            })
        }

        this.requestUpdate("question_graph");
    }
}


class Question_4 extends Question_5_14 {
    private m_questPool: string[] = []
    private m_number: { n: number, a: number, b: number, x: number, y: number } = { n: 0, a: 0, b: 0, x: 0, y: 0 };
    private m_segmentStartX: number = 0;
    private m_segmentWidth: number = 100;
    private m_segmentPositionY: [number, number] = [100, 300];
    constructor() {
        super()

        this.m_questPool.push(
            "有蓝球和排球两种，蓝球比排球的{0}倍多{1}个，蓝球比排球多{2}个，求蓝球排球各多少个？",
        )
        this.draw_answer_function = [
            this.answer_0.bind(this),
            this.answer_1.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
            this.answer_4.bind(this),
            this.answer_5.bind(this),
            this.answer_6.bind(this),
            this.answer_7.bind(this),
            this.answer_8.bind(this),
        ]
        this.regenerate();
    }

    public regenerate(): void {
        this.clean();

        this.m_number.n = Math.floor(Math.random() * 8 + 3);
        this.m_number.a = Math.floor(Math.random() * 90 + 11);

        this.m_number.y = Math.floor(Math.random() * 100 + this.m_number.a + 1);
        this.m_number.x = this.m_number.n * this.m_number.y + this.m_number.a;
        this.m_number.b = this.m_number.x - this.m_number.y

        this.m_segmentStartX = 100;

        this.analyze_panel = new Container();
        this.analyze_panel.x = 100;
        this.analyze_panel.y = 160;
        this.addChild(this.analyze_panel);

        this.m_question = CreateQuestionGraphConstructor();

        const question_index = Math.floor(Math.random() * this.m_questPool.length);
        const question_text = string_format(this.m_questPool[question_index]!, this.m_number.n, this.m_number.a, this.m_number.b);

        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
        this.m_pipeline.make_horiaontal_line(0, 0, 1024).set_position(80, 160).attach_to(this);

        this.m_pipeline.make_question_graph(this.m_question).attach_to(this.analyze_panel).set_position(10, 10).tag("question_graph");
        //this.m_pipeline.make_vertical_text(this.m_tip).attach_to(this.tip_panel).set_position(0, 30).tag("tip_vertical")
    }

    private answer_0() {
        let segment = this.m_question.segment;
        const x = this.m_segmentStartX;
        const y = this.m_segmentPositionY;
        const w = Math.floor(Math.min(this.m_segmentWidth * this.m_number.n, 500) / this.m_number.n);
        segment.push({ points: [[x, y[0]], [x + w, y[0]]], dash: true });
        segment.push({ points: [], dash: true });
        if (segment[1]) {
            for (let i = 0; i < this.m_number.n + 1; ++i) {
                segment[1].points.push([i * w + x, y[1]]);
            }
            const xOffset = Math.floor((this.m_number.a / this.m_number.y) * this.m_segmentWidth)
            segment[1].points.push([xOffset + (x + this.m_number.n * w), y[1]]);
        }

        this.m_question.text.push({
            text: "排球",
            x: 0,
            y: this.m_segmentPositionY[0] - 5,
        }, {
            text: "蓝球",
            x: 0,
            y: this.m_segmentPositionY[1] - 5,
        })

        this.requestUpdate("question_graph")
    }
    private answer_1() {
        const curly = this.m_question.curly;
        const segment = this.m_question.segment;
        if (segment[0] && segment[0].points[0] && segment[0].points[1]) {
            curly.push({
                x1: segment[0].points[0][0],
                y1: segment[0].points[0][1] - 16,
                x2: segment[0].points[1][0],
                y2: segment[0].points[0][1] - 16,
                height: 8,
                text: "1份",
            });
        }

        if (segment[1] && segment[1].points[0]) {
            const lastPoint = segment[1].points[this.m_number.n + 1];
            const prevPoint = segment[1].points[this.m_number.n];
            const y = segment[1].points[0][1] + 10;
            if (lastPoint && prevPoint) {
                curly.push({
                    x1: segment[1].points[0][0],
                    y1: y,
                    x2: prevPoint[0],
                    y2: y,
                    height: -8,
                    text: string_format("{0}份", this.m_number.n),
                });

                curly.push({
                    x1: prevPoint[0],
                    y1: y,
                    x2: lastPoint[0],
                    y2: y,
                    height: -8,
                    text: string_format("多{0}个", this.m_number.a),
                });
            }
        }
        this.requestUpdate("question_graph")
    }
    private answer_2() {
        if (this.m_question.segment[0] && this.m_question.segment[1]) {
            const topPoint = this.m_question.segment[0].points[1];
            const bottomPoint = this.m_question.segment[1].points[1];
            if (topPoint && bottomPoint) {

                this.m_question.segment.push({
                    points: [[topPoint[0], topPoint[1] - 30], [bottomPoint[0], bottomPoint[1] + 30]],
                    type: 1,
                    color: "red"
                });

            }
        }

        this.requestUpdate("question_graph")
    }
    private answer_3() {
        const points: [number, number][] = [];
        if (this.m_question.segment[1]) {
            for (let i = 1; i < this.m_question.segment[1].points.length; ++i) {
                const point = this.m_question.segment[1].points[i];
                if (point) {
                    points.push([point[0], point[1] - 80]);
                }
            }

            this.m_question.segment.push({
                points: points,
                color: "#FF00FF",
                dash: true,
            })
        }

        this.requestUpdate("question_graph");
    }

    private answer_4() {
        const segment = this.m_question.segment[3];

        if (segment) {
            const leftPoint = segment.points[0];
            const rightPoint = segment.points[this.m_number.n];
            //const splitPoint = segment.points[this.m_number.n - 1];
            if (leftPoint && rightPoint) {
                this.m_question.curly.push({
                    x1: leftPoint[0],
                    y1: leftPoint[1] + 20,
                    x2: rightPoint[0],
                    y2: leftPoint[1] + 20,
                    height: -8,
                    color: "#00BFFF",
                    text: this.m_number.b + "",
                });



            }
        }
        this.requestUpdate("question_graph");
    }

    private answer_5() {
        const segment = this.m_question.segment[3];
        if (segment) {
            const leftPoint = segment.points[0];
            const rightPoint = segment.points[this.m_number.n];
            const splitPoint = segment.points[this.m_number.n - 1];
            if (leftPoint && rightPoint && splitPoint) {
                const top = leftPoint[1] - 12;

                this.m_question.curly.push({
                    x1: leftPoint[0],
                    y1: top,
                    x2: splitPoint[0],
                    y2: top,
                    height: 8,
                    color: "#00BFFF",
                    text: string_format("{0}份", this.m_number.n - 1)
                });
                this.m_question.curly.push({
                    x1: splitPoint[0],
                    y1: top,
                    x2: rightPoint[0],
                    y2: top,
                    height: 8,
                    color: "#00BFFF",
                    text: this.m_number.a + ""
                });
            }
        }


        this.requestUpdate("question_graph");
    }

    private answer_6() {
        const totalCurly = this.m_question.curly.length;
        const curly = this.m_question.curly[totalCurly - 2];
        if (curly) {
            curly.text = string_format("{0}份 = {1} - {2} = {3} ", this.m_number.n - 1, this.m_number.b, this.m_number.a, this.m_number.b - this.m_number.a);
        }

        this.requestUpdate("question_graph");
    }
    private answer_7() {
        const curly = this.m_question.curly[0];
        if (curly) {
            curly.text = string_format("1份 = {0} ", (this.m_number.b - this.m_number.a) / (this.m_number.n - 1));
        }
        this.requestUpdate("question_graph");
    }
    private answer_8() {
        const curly = this.m_question.curly;

        curly.splice(1, 2);
        const v = (this.m_number.b - this.m_number.a) / (this.m_number.n - 1);
        const segment = this.m_question.segment[1];
        if (segment) {
            const leftPoint = segment.points[0];
            const rightPoint = segment.points[this.m_number.n + 1];
            if (leftPoint && rightPoint) {
                const y = leftPoint[1] + 12;
                curly.push({
                    x1: leftPoint[0],
                    y1: y,
                    x2: rightPoint[0],
                    y2: y,
                    height: -6,
                    text: string_format("{0} + {1} = {2}", v, this.m_number.b, this.m_number.x),
                    color: "#FF7F50",
                    textColor: "#FF7F50"
                })
            }
        }


        this.requestUpdate("question_graph");
    }
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