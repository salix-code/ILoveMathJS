import { Circle } from "pixi.js";
import { AnimalDefinition, AnimalSystem } from "../actions/animalsystem";
import { CurlyDefinition, CurlyRender } from "../actions/curlyrender";
import { DelayManager } from "../actions/delaymanager";
import { RectDefinition, RectSystem } from "../actions/rectsystem";
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
import { FTaskManager } from "../manager/taskmanager";
import { RectRender, TextRender } from "../actions/rendersystem";

function string_format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => String(args[index]));
}

class BaseView extends QuestionView {

    constructor() {
        super("")
    }
    public regenerate(): void {

    }
}


class Question_1 extends BaseView {

    protected m_number: { a: number, b: number, c: number, d: number, x: number, y: number, z: number } = { a: 0, b: 0, c: 16, d: 44, x: 2, y: 4, z: 0 }
    private m_animal: AnimalDefinition;
    private m_foot: RectDefinition;
    private m_curly: CurlyDefinition;
    protected m_name: string[] = [];

    constructor() {
        super()
        this.m_animal = new AnimalDefinition();
        this.m_curly = new CurlyDefinition();
        this.m_foot = new RectDefinition();
        this.draw_answer_function.push(
            this.answer_0.bind(this),
            this.answer_1.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
            this.answer_4.bind(this),
            this.answer_5.bind(this),
            this.answer_6.bind(this),
        );

        this.RegisterRender(new AnimalSystem(this.m_animal, this, 100, 160));
        this.RegisterRender(new CurlyRender(this.m_curly, this, 100, 160));
        this.RegisterRender(new RectSystem(this.m_foot, this, 100, 160));
        
        this.regenerate();
    }
    public regenerate(): void {
        this.clean();
        this.m_animal.Empty();
        this.m_curly.Empty();
        this.m_foot.Empty();
        this.randomData();
        this.m_pipeline.make_horiaontal_line(0, 0, 1024).set_position(80, 160).attach_to(this);
    }
    protected randomData() {
        this.m_name = [];
        const question_array = [
            "田田家她家的雞與兔子，數頭有{0}個，數腿有{1}條，請問雞與兔子各有多少個？",
        ];
        this.m_number.a = Math.floor(Math.random() * 6 + 4);
        this.m_number.b = Math.floor(Math.random() * (this.m_number.a / 2) + 2)
        this.m_name.push("雞", "兔子");

        this.m_number.d = this.m_number.x * this.m_number.a + this.m_number.b * this.m_number.y;
        this.m_number.c = this.m_number.a + this.m_number.b;
        const question_index = Math.floor(Math.random() * question_array.length);
        const question_text = string_format(question_array[question_index]!, this.m_number.c, this.m_number.d);
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
    }

    private answer_0() {
        const count = Math.floor(this.m_number.d / 2);
        const width = this.m_animal.CalcWidth(2);
        for (let i = 0; i < count; ++i) {
            this.m_animal.Add({
                x: i * (width + 20),
                y: 160,
                r: 20,
                foot: 2
            });
        }
        const leftAnimal = this.m_animal.Get(0);
        const rightAnimal = this.m_animal.Get(count - 1);

        let curlyText = string_format("全部按{0}算，一共有{1} = {2} * {3}", this.m_name[0], this.m_number.d, this.m_number.x, count);
        if (this.m_number.z > 0) {
            let lastFoot = this.m_animal.FindFootPosition(count - 1, this.m_number.x - 1);

            for (let i = 0; i < this.m_number.z; ++i) {
                this.m_foot.Add({
                    x: lastFoot[0] + 40 + i * 40,
                    y: lastFoot[1],
                    w: 16,
                    h: 16
                })
            }
            curlyText += string_format("  + {0}", this.m_number.z);
        }
        if (leftAnimal && rightAnimal) {
            this.m_curly.Add({
                x1: leftAnimal.x,
                y1: leftAnimal.y + 60,
                x2: rightAnimal.x,
                y2: leftAnimal.y + 60,
                height: -12,
                text: curlyText,
            });
        }

    }
    private answer_1() {
        const leftAnimal = this.m_animal.Get(0);
        const rightAnimal = this.m_animal.Get(this.m_number.c - 1);
        if (leftAnimal && rightAnimal) {
            this.m_curly.Add({
                x1: leftAnimal.x,
                y1: leftAnimal.y - 40,
                x2: rightAnimal.x,
                y2: leftAnimal.y - 40,
                height: 12,
                text: string_format("按頭算的話，一共有{0}", this.m_number.c)
            });
        }

        return true;
    }

    private answer_2() {

        const count = this.m_number.c;
        const pipeline = DelayManager.getInstance().create();
        const changeFootColor = (index: number) => {
            this.m_foot.Apply(index, (item) => {
                item.color = "red";
            })
        };
        if (this.m_number.z > 0) {
            for (let i = 0; i < this.m_number.z; i++) {
                pipeline.delay(changeFootColor.bind(null, this.m_number.z - 1 - i), 0.1 * (i + 1))
            }
        }
        pipeline.delay((index: number) => {
            this.m_animal.Apply(index + count, (item) => {
                item.color = "red";
            });
        }, 0.1, count);

        const lastAnimal = this.m_animal.Last();

        const leftAnimal = this.m_animal.Get(this.m_number.c);
        
        const num = (this.m_number.d / this.m_number.x - this.m_number.c) * this.m_number.x;
        if (leftAnimal && lastAnimal) {
            this.m_curly.Add({
                x1: leftAnimal.x,
                y1: leftAnimal.y - 40,
                x2: lastAnimal.x + this.m_number.z * 40,
                y2: lastAnimal.y - 40,
                height: 12,
                text: string_format("多了{0} = {1} - {2} x {3}", num,this.m_number.d ,this.m_number.c ,this.m_number.x),
                color: "red"
            });
        }

    }
    private answer_3() {
        let eIndex = this.m_number.d / this.m_number.x - 1;
        let sIndex = 0;
        this.m_curly.Apply(0, (item) => {
            item.y1 += 70
            item.y2 += 70;
        });

        let needFoot = this.m_number.y - this.m_number.x;

        const beginPoints: number[] = [];
        const endPoints: number[] = [];

        if(this.m_number.z > 0){
            let footIdx = this.m_number.z - 1;
            while (needFoot > 0 && footIdx >= 0){
                let foot = this.m_foot.Get(footIdx);
                if(foot){
                    beginPoints.push(foot.x,foot.y);
                    needFoot -= 1;
                    if(needFoot == 0){
                        break;
                    }
                }
                footIdx -= 1;
            }
        }
       

        while (needFoot > 0) {
            for (let i = this.m_number.x; i > 0; i--) {
                let pos = this.m_animal.FindFootPosition(eIndex, i - 1);
                beginPoints.push(...pos)
                needFoot -= 1

                if (needFoot <= 0) {
                    break
                }
            }
            eIndex -= 1;
        }
        needFoot = this.m_number.y - this.m_number.x;
        while (needFoot > 0) {
            for (let i = 0; i < this.m_number.y - this.m_number.x; ++i) {
                let pos = this.m_animal.FindFootPosition(sIndex, i + this.m_number.x);
                endPoints.push(...pos);
                needFoot -= 1
                if (needFoot <= 0) {
                    break
                }
            }
            sIndex += 1;
        }
        needFoot = this.m_number.y - this.m_number.x;
        for (let i = 0; i < needFoot; ++i) {
            this.m_foot.Add({
                x: beginPoints[i * 2]!,
                y: beginPoints[i * 2 + 1]!,
                w: 16,
                h: 16,
                color: 'yellow'
            })
        }

        for (let i = 0; i < needFoot; ++i) {
            this.m_foot.Add({
                x: beginPoints[i * 2]!,
                y: beginPoints[i * 2 + 1]!,
                w: 16,
                h: 16,
                color: 'gray'
            })
        }

        FTaskManager.getInstance().Lerp2(beginPoints, endPoints, 1, (pos) => {
            this.m_foot.Range(0, needFoot, (item, idx) => {
                item.x = pos[idx * 2]!;
                item.y = pos[idx * 2 + 1]!;
            });
        }).Finish(() => {
            //
        });
    }

    private answer_4() {

        this.m_animal.ForEach(0, 1, (item) => {
            item.foot = this.m_number.y;
            item.color = "#FFD700"
        });

        this.m_foot.RemoveAt(0, this.m_number.y - this.m_number.x);

        //this.m_animal.RemoveAt(lastIdx);

    }

    private answer_5() {


        const footCount = (this.m_number.d / 2 - this.m_number.c) * this.m_number.x;
        const count = footCount / (this.m_number.y - this.m_number.x);


        const changeFoot = (index: number, loop: number) => {
            this.m_animal.Apply(index, (item) => {
                item.foot = this.m_number.y;
                item.color = "#FFD700"
            });
        }

        for (let i = 1; i < count; ++i) {
            DelayManager.getInstance().create().delay(changeFoot.bind(null, i), 0.5 * i)
        }

        this.m_animal.RemoveAt(this.m_number.c, count);
        this.m_foot.Empty();
        //this.m_curly.RemoveAt(2);
        this.m_curly.Apply(2,(item)=>{
            item.color = "gray";
        })
        const scanCurly = (leftIdx: number, rightIdx: number) => {
            const leftAnimal = this.m_animal.Get(leftIdx);
            const rightAnimal = this.m_animal.Get(rightIdx);
            if (leftAnimal && rightAnimal) {
                this.m_curly.Apply(0, (item) => {
                    item.x2 = rightAnimal.x;
                });
            }
        }
        scanCurly(0, this.m_number.c - 1);

    }
    private answer_6() {
        const createCurly = (leftIdx: number, rightIdx: number, title: string) => {
            const leftAnimal = this.m_animal.Get(leftIdx);
            const rightAnimal = this.m_animal.Get(rightIdx);
            if (leftAnimal && rightAnimal) {
                this.m_curly.Add({
                    x1: leftAnimal.x,
                    y1: leftAnimal.y - 20,
                    x2: rightAnimal.x,
                    y2: rightAnimal.y - 20,
                    height: 8,
                    text: title,
                })
            }
        }

        const num = (this.m_number.d / this.m_number.x - this.m_number.c) * this.m_number.x;
        createCurly(0, this.m_number.b - 1, string_format("{0} 有 {1} = {2} / ({3} - {4})", this.m_name[1], this.m_number.b,num ,this.m_number.y,this.m_number.x));
        createCurly(this.m_number.b, this.m_number.c - 1, string_format("{0} 有 {1} = {2} - {3}", this.m_name[0], this.m_number.a,this.m_number.c,this.m_number.b));


        this.m_curly.Apply(0, (item) => {
            item.text = string_format("{0}", this.m_number.d);
        })
        this.m_curly.RemoveAt(1);

    }
}

class Question_2 extends Question_1 {

    constructor() {
        super();
    }
    protected randomData(): void {
        this.m_name = [];
        const question_array = [
            "一等座，二等座一共有{0}張，花費人民幣{1}元，其中一等座每張{2}元，二等座每張{3}元，\n請問兩種票各買了多少張？",
        ];
        this.m_number.a = Math.floor(Math.random() * 6 + 4);
        this.m_number.b = Math.floor(Math.random() * (this.m_number.a / 2) + 2)
        if (this.m_number.b % 2 == 1) {
            this.m_number.b += 1;
        }
        this.m_name.push("二等座", "一等座");
        this.m_number.x = 2;
        this.m_number.y = 3;
        this.m_number.d = this.m_number.x * this.m_number.a + this.m_number.b * this.m_number.y;
        this.m_number.c = this.m_number.a + this.m_number.b;
        const question_index = Math.floor(Math.random() * question_array.length);
        const question_text = string_format(question_array[question_index]!, this.m_number.c, this.m_number.d, this.m_number.y, this.m_number.x);
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
    }


}

class Question_3 extends Question_1 {
    constructor() {
        super();
    }
    protected randomData(): void {
        this.m_name = [];
        const question_array = [
            "有三輪車與自行車兩種，一共擺放了{0}輛，輪子一共有{1}個，請問三輪車有多少輛?",
        ];
        this.m_number.a = Math.floor(Math.random() * 6 + 4);
        this.m_number.b = Math.floor(Math.random() * (this.m_number.a / 2) + 2)
        if (this.m_number.b % 2 == 0) {
            this.m_number.b += 1;
        }
        this.m_name.push("自行車", "三輪車");
        this.m_number.x = 2;
        this.m_number.y = 3;
        this.m_number.d = this.m_number.x * this.m_number.a + this.m_number.b * this.m_number.y;
        this.m_number.c = this.m_number.a + this.m_number.b;
        this.m_number.z = this.m_number.d % this.m_number.x;
        const question_index = Math.floor(Math.random() * question_array.length);
        const question_text = string_format(question_array[question_index]!, this.m_number.c, this.m_number.d, this.m_number.y, this.m_number.x);
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
    }
}

class Question_4 extends BaseView {

}

class Question_5 extends BaseView {

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
        });
    }
};

export const APP_Math_5_16: QuestionTableItem = {
    category: "奥数",
    title: "鸡兔同笼",
    creator: () => new Controller()
}
