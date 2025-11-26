import { AnimalDefinition, AnimalSystem } from "../actions/animalsystem";
import { CurlyDefinition, CurlyRender } from "../actions/curlyrender";
import { DelayManager } from "../actions/delaymanager";
import { RectDefinition, RectSystem } from "../actions/rectsystem";
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
import { FTaskManager } from "../manager/taskmanager";

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

    private m_number: { a: number, b: number, c: number, d: number, e: number } = { a: 0, b: 0, c: 16, d: 44, e: 4 }
    private m_animal: AnimalDefinition;
    private m_foot: RectDefinition;
    private m_curly: CurlyDefinition;
    private m_name: string[] = [];
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
        );

        this.regenerate();
    }
    public regenerate(): void {
        this.clean();
        this.m_animal.Empty();
        this.m_curly.Empty();
        this.m_name = [];

        const question_array = [
            "田田家她家的雞與兔子，數頭有{0}個，數腿有{1}條，請問雞與兔子各有多少個？",
            "有甲乙兩種戲票一共{0}張，一共用去{1}元，其中甲每張3元，乙每張2元，問兩種票各多少張"
        ];
        this.m_number.a = Math.floor(Math.random() * 6 + 4);
        this.m_number.b = Math.floor(Math.random() * (this.m_number.a / 2) + 2)


        const question_index = Math.floor(Math.random() * question_array.length);
        if (question_index == 0) {
            this.m_number.e = 4;
            this.m_name.push("雞", "兔子");
        }
        else if (question_index == 1) {
            this.m_number.e = Math.floor(Math.random() + 0.5) + 3;
            this.m_name.push("乙", "甲")
        } else if (question_index == 2) {
            this.m_number.e = 3;
        }
        this.m_number.d = 2 * this.m_number.a + this.m_number.b * this.m_number.e;
        if (this.m_number.d % 2 == 1) {
            this.m_number.a -= 1;
            this.m_number.b += 1;
            this.m_number.d = 2 * this.m_number.a + this.m_number.b * this.m_number.e;
        }
        this.m_number.c = this.m_number.a + this.m_number.b;

        const question_text = string_format(question_array[question_index]!, this.m_number.c, this.m_number.d);
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
        this.m_pipeline.make_horiaontal_line(0, 0, 1024).set_position(80, 160).attach_to(this);

        this.RegisterRender(new AnimalSystem(this.m_animal, this, 100, 160));
        this.RegisterRender(new CurlyRender(this.m_curly, this, 100, 160));
        this.RegisterRender(new RectSystem(this.m_foot, this, 100, 160));
    }

    private answer_0() {
        const count = Math.floor(this.m_number.d / 2);

        for (let i = 0; i < count; ++i) {
            this.m_animal.Add({
                x: 20 + i * 60,
                y: 160,
                r: 20,
                foot: 2
            });
        }

        this.m_curly.Add({
            x1: 20,
            y1: 160 + 60,
            x2: 20 + (this.m_number.d / 2) * 60 - 60,
            y2: 160 + 60,
            height: -12,
            text: string_format("全部按{0}算，一共有{1} / 2 = {2}", this.m_name[0], this.m_number.d, count)
        });
    }
    private answer_1() {
        this.m_curly.Add({
            x1: 20,
            y1: 160 - 40,
            x2: 20 + (this.m_number.c) * 60 - 60,
            y2: 160 - 40,
            height: 12,
            text: string_format("按頭算的話，一共有{0}", this.m_number.c)
        });
    }

    private answer_2() {

        const count = this.m_number.c;
        DelayManager.getInstance().create()
            .delay((index: number) => {
                this.m_animal.Apply(index + count, (item) => {
                    item.color = "red";
                });
            }, 0.2, count);

        const lastAnimal = this.m_animal.Last();
        if (!lastAnimal) {
            return;
        }
        this.m_curly.Add({
            x1: 20 + (this.m_number.c) * 60,
            y1: 160 - 40,
            x2: lastAnimal.x,
            y2: 160 - 40,
            height: 12,
            text: string_format("多了{0}", this.m_number.b),
            color: "red"
        });
    }
    private answer_3() {
        const eIndex = this.m_number.c;
        const sIndex = 0;

        const footCount = Math.floor(2 / (this.m_number.e - 2) + 0.01);

        this.m_curly.Apply(0, (item) => {
            item.y1 += 60
            item.y2 += 60;
        });
        
        const leftAnim = this.m_animal.Get(sIndex);
        const rightAnim = this.m_animal.Get(eIndex);

        if (leftAnim && rightAnim) {
            const leftX = leftAnim.x;
            const rightX = rightAnim.x;
            const leftY = leftAnim.y + 60;
            const rightY = rightAnim.y;
            FTaskManager.getInstance().Lerp2([rightX, rightY], [leftX, leftY], 1, ([x, y]) => {
                this.m_animal.Apply(eIndex, (item) => {
                    item.x = x!;
                    item.y = y!;
                });
            });
        }
    }

    private answer_4() {

        this.m_animal.ForEach(1,this.m_number.c,(item1,idx)=>{
            const origin = item1.x;
            FTaskManager.getInstance().Lerp1(origin,origin + 60,0.6,(x)=>{
                this.m_animal.Apply(idx,(item)=>{
                    item.x = x
                })
                
            });
        })

    }

    private answer_5() {
        this.m_animal.Apply(0,(item)=>{
            item.foot = this.m_number.e;
        })
    }
}

class Question_2 extends BaseView {

    private m_number: { a: number, b: number, c: number, d: number } = { a: 0, b: 0, c: 16, d: 44 }
    private m_animal: AnimalDefinition;
    private m_curly: CurlyDefinition;
    constructor() {
        super()
        this.m_animal = new AnimalDefinition();
        this.m_curly = new CurlyDefinition();
        this.draw_answer_function.push(
            this.answer_0.bind(this),
            this.answer_1.bind(this),
            this.answer_2.bind(this),
            this.answer_3.bind(this),
            this.answer_4.bind(this),
            this.answer_5.bind(this),
        );

        this.regenerate();
    }
    public regenerate(): void {
        this.clean();
        this.m_animal.Empty();
        this.m_curly.Empty();
        const question_array = [
            "有甲乙兩種戲票一共{0}張，一共用去{1}元，其中甲每張3元，乙每張2元，問兩種票各多少張"
        ];
        this.m_number.a = Math.floor(Math.random() * 6 + 4);
        this.m_number.b = Math.floor(Math.random() * (this.m_number.a / 2) + 2)
        this.m_number.c = this.m_number.a + this.m_number.b;
        this.m_number.d = 2 * this.m_number.a + this.m_number.b * 4;

        const question_index = Math.floor(Math.random() * question_array.length);
        const question_text = string_format(question_array[question_index]!, this.m_number.c, this.m_number.d);
        this.m_pipeline.make_text(question_text).attach_to(this).set_position(100, 80);
        this.m_pipeline.make_horiaontal_line(0, 0, 1024).set_position(80, 160).attach_to(this);

        this.RegisterRender(new AnimalSystem(this.m_animal, this, 100, 160));
        this.RegisterRender(new CurlyRender(this.m_curly, this, 100, 160));
    }

    private answer_0() {
        for (let i = 0; i < this.m_number.d / 2; ++i) {
            this.m_animal.Add({
                x: 20 + i * 60,
                y: 100,
                r: 20,
                foot: 2
            });
        }

        this.m_curly.Add({
            x1: 20,
            y1: 100 + 60,
            x2: 20 + (this.m_number.d / 2) * 60 - 60,
            y2: 100 + 60,
            height: -12,
            text: string_format("按腿算的話，假设全部是雞，一共有{0} / 2 = {1}", this.m_number.d, this.m_number.d / 2)
        });


    }
    private answer_1() {
        this.m_curly.Add({
            x1: 20,
            y1: 100 - 40,
            x2: 20 + (this.m_number.c) * 60 - 60,
            y2: 100 - 40,
            height: 12,
            text: string_format("按頭算的話，一共有{0}", this.m_number.c)
        });
    }

    private answer_2() {


        const count = this.m_number.c;

        DelayManager.getInstance().create()
            .delay((index: number) => {
                this.m_animal.Apply(index + count, (item) => {
                    item.color = "red";
                });
            }, 0.2, count);

        const lastAnimal = this.m_animal.Last();
        if (!lastAnimal) {
            return;
        }
        this.m_curly.Add({
            x1: 20 + (this.m_number.c) * 60,
            y1: 100 - 40,
            x2: lastAnimal.x,
            y2: 100 - 40,
            height: 12,
            text: string_format("多了{0}", this.m_number.b),
            color: "red"
        });
    }
    private answer_3() {
        const count = this.m_number.d / 2 - this.m_number.c;
        const sIndex = this.m_number.a;
        const eIndex = this.m_number.c;
        this.m_curly.RemoveAt(2);

        let originX: number[] = [];
        for (let i = 0; i < count; ++i) {
            let animal = this.m_animal.Get(eIndex + i);
            if (animal) {
                originX.push(animal.x)
            }
        }

        const lastAnim = this.m_animal.Last();
        const lastAnimalX = lastAnim?.x;

        const targetAnimal = this.m_animal.Get(this.m_number.c - 1);
        const targetAnimalX = targetAnimal?.x;

        FTaskManager.getInstance().Lerp1(0, count * 60, 1.0, (offset: number) => {
            for (let i = 0; i < count; ++i) {
                this.m_animal.Apply(eIndex + i, (animal) => {
                    animal.x = originX[i]! - offset
                });
            }
        }).Finish(() => {
            for (let i = 0; i < count; ++i) {
                this.m_animal.Apply(sIndex + i, (animal) => {
                    animal.foot = 4;
                    animal.color = "#FFA500"
                });
            }
            this.m_animal.RemoveAt(this.m_number.c, this.m_number.b);

        });


        FTaskManager.getInstance().Lerp1(lastAnimalX!, targetAnimalX!, 1.0, (x) => {
            this.m_curly.Apply(0, (item) => {
                item.x2 = x;
            })
        });

        this.m_curly.Apply(0, (item) => {
            item.text = string_format("腿的数量还是：{0} / 2 = {1}", this.m_number.d, this.m_number.d / 2);
        })
    }

    private answer_4() {

        const firstAnimal = this.m_animal.Get(this.m_number.c - 1);
        const lastAnimal = this.m_animal.Get(this.m_number.a - 1);
        if (firstAnimal && lastAnimal) {
            FTaskManager.getInstance().Lerp1(firstAnimal.x, lastAnimal.x, 0.5, (x) => {
                this.m_curly.Apply(1, (curly) => {
                    curly.x2 = x;
                });
            }).Finish(() => {
                this.m_curly.Apply(1, (curly) => {
                    curly.text = string_format("鸡有{0}", this.m_number.a);
                })
            });
        }




    }

    private answer_5() {
        const x: number[] = [];
        let anim = this.m_animal.Get(this.m_number.a);
        if (anim) {
            x.push(anim.x)
        }
        anim = this.m_animal.Get(this.m_number.c - 1);
        if (anim) {
            x.push(anim.x)
        }
        if (x.length == 2) {
            this.m_curly.Add({
                x1: x[0]!,
                y1: 100 - 40,
                x2: x[1]!,
                y2: 100 - 40,
                height: 8,
                text: string_format("兔子{0}", this.m_number.b)
            })
        }




    }
}

class Question_3 extends BaseView {

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
