import { Container, Text } from "pixi.js";
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
import { HorizontalSegmentOperator, type HorizontalSegmentInitializer } from "../component/segment";
import type { ArrowInitializer } from "../component/arrow";
import { SegmentData, SegmentRender, type SegmentDefinition } from "../actions/rendersystem";
import { CurlyDefinition, CurlyRender } from "../actions/curlyrender";
import { DelayManager } from "../actions/delaymanager";
import { FTaskManager } from "../manager/taskmanager";


function string_format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => String(args[index]));
}


class MathView extends QuestionView {
    protected analyze_panel: Container | null = null;
    protected tip_panel: Container | null = null;
    protected m_segment: SegmentData;
    protected m_curly: CurlyDefinition;
    constructor() {
        super("")
        this.m_segment = new SegmentData();
        this.m_curly = new CurlyDefinition();
    }
    public clean(): void {
        super.clean();
        this.m_segment.Empty();
        this.m_curly.Empty();
    }

}

class Question_1 extends MathView {
    private m_number: { a: number, b: number, c: number } = { a: 0, b: 0, c: 0 }
    private m_segmentRender: SegmentRender;
    
    constructor() {
        super()
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

        this.m_segmentRender = new SegmentRender(this.m_segment, this, 100, 160);
        
        this.RegisterRender( new CurlyRender(this.m_curly, this, 100, 160))
        this.regenerate()
    }
    //[0,x] [x,a]
    public regenerate(): void {

        this.clean();


        this.m_number.a = Math.floor(Math.random() * 20 + 50);
        this.m_number.b = Math.floor(Math.random() * (0.3 * this.m_number.a) + (0.1 * this.m_number.a));
        this.m_number.c = Math.floor(Math.random() * (0.4 * this.m_number.a) + (0.2 * this.m_number.a))
        const total = 3 * (this.m_number.a + this.m_number.b) + this.m_number.c;
        const question_array = [
            "三个小朋友一共有{0}，每人花去相同的钱后，\n丙还剩下{1}元钱，乙剩下的钱数是甲剩下的2倍，那么甲原有多少钱？"
        ];

        const question_index = Math.floor(Math.random() * question_array.length);
        const question_text = string_format(question_array[question_index]!, total, this.m_number.c);
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
        this.m_pipeline.make_horiaontal_line(0, 0, 1024).set_position(80, 160).attach_to(this);

        for (let i = 0; i < 3; ++i) {
            const segment: SegmentDefinition = {
                points: []
            };
            this.m_segment.Add(segment);
        }

        this.m_segmentRender.redraw();
        
    }

    private answer_0() {
        const widthScale = 100 / this.m_number.a;
        const beginX = 100;
        let segment = this.m_segment.Get(0);
        if (segment) {
            segment.points.push({ x: beginX + this.m_number.b * widthScale, y: 100, dash: true });
            segment.points.push({ x: beginX + this.m_number.b * widthScale + 100, y: 100, dash: true });
        }

        segment = this.m_segment.Get(1);
        if (segment) {
            segment.points.push({ x: beginX + this.m_number.b * widthScale, y: 200, dash: true });
            segment.points.push({ x: beginX + this.m_number.b * widthScale + 100, y: 200, dash: true });
            segment.points.push({ x: beginX + this.m_number.b * widthScale + 200, y: 200, dash: true });
        }

        segment = this.m_segment.Get(2);
        if (segment) {
            const x = beginX + this.m_number.b * widthScale
            segment.points.push({ x: x, y: 300, dash: true });
            segment.points.push({ x: x + this.m_number.c * widthScale, y: 300, dash: true });

            this.m_curly.Add({
                x1: x,
                y1: 296,
                x2: x + this.m_number.c * widthScale,
                y2: 296,
                height: 8,
                text: string_format("还剩下{0}", this.m_number.c)
            });
        }

        
        this.m_segmentRender.redraw();

    }
    private answer_1() {
        const beginX = 100;
        const offsetY: number[] = [100, 200, 300];
        for (let i = 0; i < 3; ++i) {
            let segment = this.m_segment.Get(i);
            if (segment) {
                segment.points.splice(0, 0, { x: beginX, y: offsetY[i]!, dash: true })
            }
        }
        let segment = this.m_segment.Get(0);

        if (segment && segment.points[2]) {
            this.m_curly.Add({
                x1: beginX,
                y1: offsetY[0]! - 20,
                x2: segment.points[2].x,
                y2: offsetY[0]! - 20,
                height: 10,
                color:"#FF0000",
                text : "?"
            })
        }
        this.m_segmentRender.redraw();
    }

    private answer_2() {
        const total = 3 * (this.m_number.a + this.m_number.b) + this.m_number.c;
        const segment = this.m_segment.Get(1);
        if (!segment) {
            return;
        }
        const x = segment.points[segment.points.length - 1]!.x + 20
        this.m_curly.Add({
            x1: x,
            y1: 100,
            x2: x,
            y2: 300,
            height: 8,
            text: string_format("一共有{0}", total)
        });

    }


    private answer_3() {

        const segment = this.m_segment.Get(2);
        if (segment) {
            segment.points.splice(segment.points.length - 1, 1);
        }
        this.m_curly.RemoveAt(0);

        this.m_curly.Apply(1,(curly)=>{
            const total = 3 * (this.m_number.a + this.m_number.b) + this.m_number.c;
            curly.text = string_format("一共还有{0} - {1} = {2}", total, this.m_number.c,total - this.m_number.c);
        })
        
        this.m_segmentRender.redraw();
    }
    private answer_4() {

        // FTaskManager.getInstance().Lerp1(1, 0, 2, (alpha: number) => {
        //     if (typeof alpha === 'number') {
        //         this.m_segment.Apply(1, function (item: SegmentDefinition) {
        //             item.points[item.points.length - 2]!.alpha! = alpha;
        //         });
        //         this.m_segmentRender.redraw();
        //     }
        // }).Finish(() => {
        //     this.m_segment.Apply(1, function (item: SegmentDefinition) {
        //         item.points.splice(item.points.length - 1, 1);
        //     });
        //     this.m_segmentRender.redraw();
        // });

        let segment = this.m_segment.Get(1);
        let beginPos: number[] = []
        let targetPos: number[] = [];
        if (segment) {
            beginPos.push(segment.points[2]!.x);
            beginPos.push(segment.points[3]!.x);
            beginPos.push(segment.points[3]!.y);

            targetPos.push(0);
            targetPos.push(segment.points[2]!.x);

            segment.points.splice(3, 1);
        }
        segment = this.m_segment.Get(2);
        if (segment) {
            targetPos[0] = segment.points[1]!.x;
            targetPos.push(segment.points[1]!.y);
        }
        this.m_segment.Add({
            points: [{ x: beginPos[0]!, y: beginPos[2]!, dash: true, color: "#FFA500" }, { x: beginPos[1]!, y: beginPos[2]!, dash: true }]
        });


        FTaskManager.getInstance().Lerp2(beginPos, targetPos, 2, (pos: number[]) => {
            let segment = this.m_segment.Get(3)
            if (segment) {
                segment.points[0]!.x = pos[0]!;
                segment.points[0]!.y = pos[2]!;
                segment.points[1]!.x = pos[1]!;
                segment.points[1]!.y = pos[2]!;
            }
            this.m_segmentRender.redraw();
        }).Finish(()=>{
            this.m_segment.Apply(2,(segment:SegmentDefinition)=>{

                let copysegment = this.m_segment.Get(3)
                segment.points.splice(2,0,copysegment!.points[1]!);
                this.m_segment.RemoveAt(3);
            });
        });

        this.m_curly.Apply(1,(curly)=>{
            const total = 3 * (this.m_number.a + this.m_number.b) + this.m_number.c;
            curly.text += string_format("\n 把乙多的移到下面");
        })



        // DelayManager.getInstance().create().delay(() => {
        //     this.m_segment.Apply(1, function (item: SegmentDefinition) {
        //         item.points[item.points.length - 2]!.color = "#39FF14"
        //     });
        //     this.m_segmentRender.redraw();
        // }, 20).delay(() => {
        //     let segment = this.m_segment.Get(0);

        //     if (segment) {
        //         const point = segment.points[segment.points.length - 1]!;
        //         this.m_segment.Apply(2, function (item: SegmentDefinition) {
        //             item.points[item.points.length - 1]!.color = "#39FF14"
        //             item.points.push({ x: point.x, y: 300, dash: true })
        //         });
        //         this.m_segmentRender.redraw();
        //     }
        // },2)




    }
    private answer_5() {
        
        
    }

    // [0,x] [ x ,a] => [0,x,a]
    // [0,x] [x ,a ] [a,a + a - x] => [0,x,a,aa-2]
    // [0,x] [x ,y] => [0,x,x+y]
    // t = 3 * a + y

    private answer_6() {

        let segment = [this.m_segment.Get(0),this.m_segment.Get(2)];
        if(segment[0] && segment[1]){
            this.m_segment.Add({
                points:[{x:segment[0].points[0]!.x,y : segment[0].points[0]!.y - 30},{x:segment[1].points[0]!.x,y : segment[1].points[0]!.y + 30}],
                color : "#8A2BE2"
            });
            this.m_segment.Add({
                points:[{x:segment[0].points[2]!.x,y : segment[0].points[2]!.y - 30},{x:segment[1].points[2]!.x,y : segment[1].points[2]!.y + 30}],
                color : "#8A2BE2"
            });

            this.m_segmentRender.redraw();
        }
        
    }

    private answer_7() {
        this.m_curly.Apply(0,(curly)=>{
            const total = 3 * (this.m_number.a + this.m_number.b) + this.m_number.c;
            curly.text = string_format("平分成3份 =>  {0}/3 = {1}", 3 * (this.m_number.a + this.m_number.b), (this.m_number.a + this.m_number.b))
        })
    }
}



class Question_2 extends QuestionView {
    private m_number: { x: number, a: number } = { x: 0, a: 0 };
    private analyze_panel: Container | null = null;
    constructor() {
        super("")
        this.draw_answer_function = [
            this.answer_0.bind(this)
        ]
        this.regenerate();
    }
    public regenerate(): void {
        this.clean();
        const question_array = [
            "妈妈买回来一些苹果和橘子,\n丁丁数了数,其中有{0}个苹果,\n橘子的个数是苹果的{1}倍{2}\n,请问橘子有多少个?"
        ]

        this.analyze_panel = new Container();
        this.analyze_panel.x = 500
        this.analyze_panel.y = 20
        this.addChild(this.analyze_panel)

        this.m_pipeline.make_vertical_line(480, 20, 480).attach_to(this)

        this.m_number.x = Math.floor(Math.random() * 18 + 2);
        this.m_number.a = Math.floor(Math.random() * 3 + 3);


        const b = Math.random() * 2;
        let m_text = ""
        if (b == 1) {
            const neg = Math.random() * 2;
            const m = Math.floor(Math.random() * (this.m_number.x - 1)) + 1;
            if (neg == 0) {
                m_text = "多" + m + "个"
            } else {
                m_text = "少" + m + "个"
            }
        }
        const question_index = Math.floor(Math.random() * question_array.length);
        const text = string_format(question_array[question_index]!, this.m_number.x, this.m_number.a, m_text)
        this.m_pipeline.make_text(text).attach_to(this).set_position(100, 20);
    }

    private answer_0() {
        const text = "解"
        this.m_pipeline.make_text(text).attach_to(this.analyze_panel).set_position(0, 20)

        this.m_pipeline.make_text("橘子的数量是: " + this.m_number.x + "x" + this.m_number.a).attach_to(this.analyze_panel).set_position(20, 60);
    }
}


class Question_3 extends QuestionView {
    private m_number: { x: number, m: number, a: number } = { x: 0, m: 0, a: 0 };
    constructor() {
        super("")
    }
    public regenerate(): void {
        this.clean();

        const question_array = [
            "妈妈买回来一些苹果和橘子,丁丁数了数\n其中有{0}个橘子，橘子的个数是苹果的{1}倍{2},苹果有多个少？"
        ]

        const apple = Math.floor(Math.random() * 12 + 8);
        this.m_number.a = Math.floor(Math.random() * 3 + 3);
        this.m_number.x = apple * this.m_number.a;


        const question_index = Math.floor(Math.random() * question_array.length)

        const text = string_format(question_array[question_index]!, this.m_number.x, this.m_number.a, "");
        this.m_pipeline.make_text(text).attach_to(this).set_position(100, 40)
    }
}

class Question_4 extends QuestionView {
    private m_number: { t: number, a: number, m: number } = { t: 0, a: 0, m: 0 };
    constructor() {
        super("")
    }
    public regenerate(): void {
        this.clean();

        const question_des = ["妈妈买回来一些苹果和橘子,丁丁数了数\n", "一共买了{0}个", "橘子的个数是苹果的{0}倍，", "", "橘子和苹果各有多个少？"]
        // x = t / (a + 1)
        // y = x * a
        this.m_number.a = Math.floor(Math.random() * 3 + 3);
        const apple = Math.floor(Math.random() * 12 + 8);
        const orange = this.m_number.a * apple;
        const b = Math.random() * 10;
        if (b <= 1) {
            this.m_number.m = 0
        }
        else if (b <= 5) {
            this.m_number.m = Math.floor(Math.random() * (this.m_number.a - 1)) + 1;

        }
        else {
            this.m_number.m = -1 * (Math.floor(Math.random() * (this.m_number.a - 1)) + 1);
        }
        this.m_number.t = apple + orange + this.m_number.m;

        question_des[1] = string_format(question_des[1]!, this.m_number.t);
        question_des[2] = string_format(question_des[2]!, this.m_number.a);
        if (this.m_number.m > 0) {
            question_des[3] = string_format("多{0}个\n", this.m_number.m);
        }
        else if (this.m_number.m < 0) {
            question_des[3] = string_format("少{0}个\n", this.m_number.m);
        }

        const text = question_des.join(",");
        this.m_pipeline.make_text(text).attach_to(this).set_position(100, 20)
    }
}

class Question_5 extends QuestionView {
    private m_number: { t: number, a: number, m: number } = { t: 0, a: 0, m: 0 };
    constructor() {
        super("")
    }
    public regenerate(): void {
        this.clean();

        const question_array = [
            "妈妈买回来一些苹果和橘子,丁丁数了数\n，一共买了{0}个，橘子的个数是苹果的{1}倍{2}，橘子和苹果各有多个少？"
        ]
        // x = t / (a + 1)
        // y = x * a
        this.m_number.a = Math.floor(Math.random() * 3 + 3);
        const apple = Math.floor(Math.random() * 12 + 8);
        const orange = this.m_number.a * apple;
        const b = Math.random() * 10;
        if (b <= 1) {
            this.m_number.m = 0
        }
        else if (b <= 5) {
            this.m_number.m = Math.floor(Math.random() * (this.m_number.a - 1)) + 1;

        }
        else {
            this.m_number.m = -1 * (Math.floor(Math.random() * (this.m_number.a - 1)) + 1);
        }
        this.m_number.t = apple + orange + this.m_number.m;
        let external_text = "";
        if (this.m_number.m > 0) {
            external_text = string_format("多{0}个", this.m_number.m);
        } else if (this.m_number.m < 0) {
            external_text = string_format("少{0}个", this.m_number.m * -1);
        }
        const question_index = Math.floor(Math.random() * question_array.length);

        const text = string_format(question_array[question_index]!, this.m_number.t, this.m_number.a, external_text)
        this.m_pipeline.make_text(text).attach_to(this).set_position(100, 20)
    }
}

class Question_6 extends QuestionView {
    private m_number: { x: number, y: number, a: number } = { x: 0, y: 0, a: 0 };
    constructor() {
        super("")
    }
    public regenerate(): void {
        this.clean();

        const question_array = [
            "甲队有{0}人，乙队有{1}人,甲队要调多少人到乙队，乙队的人数会是甲队的{2}倍?",
            "姐姐有{0}本书，弟弟有{1}本书,弟弟要把多少本书借给姐姐，姐姐的书会是弟弟的{2}倍?",
        ]

        this.m_number.a = Math.floor(Math.random() * 3 + 7);
        const x1 = Math.floor(Math.random() * 19 + 11);
        const y1 = x1 * this.m_number.a;

        const m = Math.floor(Math.random() * ((this.m_number.a - 1) * x1 / 2 - 1) + 1);

        this.m_number.x = x1 + m;
        this.m_number.y = y1 - m;
        const question_index = Math.floor(Math.random() * question_array.length);
        const text = string_format(question_array[question_index]!, this.m_number.x, this.m_number.y, this.m_number.a);
        this.m_pipeline.make_text(text).attach_to(this).set_position(100, 20)
    }
}

class Question_7 extends QuestionView {
    private m_number: { t: number, m: number, a: number } = { t: 0, m: 0, a: 0 };
    constructor() {
        super("")
    }
    public regenerate(): void {
        this.clean();

        const question_array = [
            "甲队和乙队一共有{0}人,甲队借调{1}人到乙队后，乙队的人数会是甲队的{2}倍，请问之前甲队和乙队各多少人？",
            "姐姐和弟弟一共有{0}本书，弟弟借给姐姐{1}本书后，姐姐的书是弟弟的{2}倍，请问之前姐姐和弟弟各有多少本书？",
        ]

        this.m_number.a = Math.floor(Math.random() * 3 + 7);
        const y = Math.floor(Math.random() * 19 + 11);
        this.m_number.m = Math.floor(Math.random() * (y - 1) + 1);
        this.m_number.t = (1 + this.m_number.a) * y;

        const question_index = Math.floor(Math.random() * question_array.length);
        const text = string_format(question_array[question_index]!, this.m_number.t, this.m_number.m, this.m_number.a);
        this.m_pipeline.make_text(text).attach_to(this).set_position(100, 20)
    }
}

class Question_8 extends QuestionView {
    private m_number: { t: number, m: number, a: number } = { t: 0, m: 0, a: 0 };
    constructor() {
        super("")
    }
    public regenerate(): void {
        this.clean();

        const question_array = [
            "甲队和乙队一共有{0}人,甲队借调{1}人到乙队后，乙队的人数会是甲队的{2}倍，请问之前甲队和乙队各多少人？",
            "甲队和乙队一共有{0}人,乙队向甲队借调{1}，乙队的人数会是甲队的{2}倍，请问之前甲队和乙队各多少人？",
            "姐姐和弟弟一共有{0}本书，弟弟借给姐姐{1}本书后，姐姐的书是弟弟的{2}倍，请问之前姐姐和弟弟各有多少本书？",
        ]

        this.m_number.a = Math.floor(Math.random() * 3 + 7);
        const y = Math.floor(Math.random() * 19 + 11);
        this.m_number.m = Math.floor(Math.random() * (y - 1) + 1);
        this.m_number.t = (1 + this.m_number.a) * y;

        const question_index = Math.floor(Math.random() * question_array.length);
        const text = string_format(question_array[question_index]!, this.m_number.t, this.m_number.m, this.m_number.a);
        this.m_pipeline.make_text(text).attach_to(this).set_position(100, 20)
    }
}

class Question_9 extends QuestionView {
    private m_number: { t: number, m: number, n: number } = { t: 0, m: 0, n: 0 };
    private m_segment_initializers: HorizontalSegmentInitializer[] = []
    constructor() {
        super("")
        this.draw_answer_function = [
            this.answer_0.bind(this)
        ]
    }
    public regenerate(): void {
        this.clean();
        const question_array = [
            "图书馆内，科技书是图画书的{0}倍，连环画书是科技书的{1}倍，已知三种书一个{2}本，请问三种图书各多少本"
        ]

        this.m_number.m = Math.floor(Math.random() * 4 + 1);
        this.m_number.n = Math.floor(Math.random() * 3 + 1);
        const x = Math.floor(Math.random() * 99 + 1);
        this.m_number.t = (1 + this.m_number.m + this.m_number.m * this.m_number.n) * x;

        const question_index = Math.floor(Math.random() * question_array.length);
        const text = string_format(question_array[question_index]!, this.m_number.t, this.m_number.m, this.m_number.n);
        this.m_pipeline.make_text(text).attach_to(this).set_position(100, 20)
    }

    private answer_0() {

        //this.m_pipeline.make_text("图画书").set_position();
        //this.m_pipeline.make_text("科技书").set_position();
        //this.m_pipeline.make_text("连环画").set_position();


        //

    }
    private answer_1() {
        // 拆分最大的那个线

    }
}


class Question_10 extends QuestionView {
    private m_number: { t: number, m: number, a: number, n: number, b: number } = { t: 0, m: 0, a: 0, n: 0, b: 0 };
    constructor() {
        super("")
    }
    public regenerate(): void {
        this.clean();

        const question_array = [
            "图书馆内，科技书是图画书的{0}倍{1}，连环画书是科技书的{1}倍{2}，已知三种书一个{2}本，请问三种图书各多少本"
        ]
        // t = x + x * m + a + (x * m + a) * n + b
        this.m_number.m = Math.floor(Math.random() * 4 + 1);
        this.m_number.n = Math.floor(Math.random() * 3 + 1);
        const x = Math.floor(Math.random() * 99 + 1);
        this.m_number.a = (Math.floor(Math.random() * 2) - 1) * Math.floor(Math.random() * (x - 1) + 1);

        const y = this.m_number.m * x + this.m_number.a;
        this.m_number.b = (Math.floor(Math.random() * 2) - 1) * Math.floor(Math.random() * (y - 1) + 1);
        const z = this.m_number.n * y + this.m_number.b;
        this.m_number.t = x + y + z;

        const str_a = this.m_number.a > 0 ? "多" + this.m_number.a + "本" : "少" + this.m_number.a + "本"
        const str_b = this.m_number.b > 0 ? "多" + this.m_number.b + "本" : "少" + this.m_number.b + "本"
        const question_index = Math.floor(Math.random() * question_array.length);
        const text = string_format(question_array[question_index]!, this.m_number.m, str_a, this.m_number.n, str_b, this.m_number.t);

        this.m_pipeline.make_text(text).attach_to(this).set_position(100, 20)
    }
}



class Controller extends QuestionController {
    constructor() {
        super();
        this.question_templates.push({
            template: Question_1,
            title: "简单和倍 - 1",
        }, {
            template: Question_2,
            title: "简单和倍 - 2",
        }, {
            template: Question_3,
            title: "简单和倍 - 3",
        }, {
            template: Question_4,
            title: "简单和倍 - 4",
        }, {
            template: Question_5,
            title: "简单和倍 - 5",
        }, {
            template: Question_6,
            title: "简单和倍 - 6",
        }, {
            template: Question_7,
            title: "简单和倍 - 7",
        }, {
            template: Question_8,
            title: "简单和倍 - 8",
        }, {
            template: Question_9,
            title: "简单和倍 - 9",
        }, {
            template: Question_10,
            title: "简单和倍 - 10",
        });
    }
};


export const APP_Math_5_13: QuestionTableItem = {
    category: "奥数",
    title: "和倍问题",
    creator: () => new Controller()
}