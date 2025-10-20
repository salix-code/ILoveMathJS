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

        this.clean();

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

        HorizontalSegmentOperator.remove(2,this.m_segment_initializers[1]);
        HorizontalSegmentOperator.insert(1,{width:this.m_number.a},this.m_segment_initializers[2]);

        this.m_pipeline.redraw("answer.2.segment","answer.3.segment")
        
    }
    
    private answer_7(){
        
    }
}



class Question_2 extends QuestionView{
    private m_number : {x:number,a:number} = {x : 0,a : 0};
    private analyze_panel:Container | null = null;
    constructor(){
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

        this.m_pipeline.make_vertical_line(480,20,480).attach_to(this)
        
        this.m_number.x = Math.floor(Math.random() * 18 + 2);
        this.m_number.a = Math.floor(Math.random() * 3 + 3);
        

        const b = Math.random() * 2;
        let m_text = ""
        if(b == 1)
        {
            const neg = Math.random() * 2;
            const m = Math.floor(Math.random() * (this.m_number.x - 1) ) + 1;
            if(neg == 0){
                m_text = "多" + m + "个"
            } else {
                m_text = "少" + m + "个"
            }
        }
        const question_index = Math.floor(Math.random() * question_array.length);
        const text = string_format(question_array[question_index]!,this.m_number.x,this.m_number.a,m_text)
        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20);
    }

    private answer_0(){
        const text = "解"
        this.m_pipeline.make_text(text).attach_to(this.analyze_panel).set_position(0,20)

        this.m_pipeline.make_text("橘子的数量是: " + this.m_number.x + "x" + this.m_number.a).attach_to(this.analyze_panel).set_position(20,60);
    }
}


class Question_3 extends QuestionView{
    private m_number : {x:number, m:number,a:number} = {x : 0, m : 0,a : 0};
    constructor(){
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

        const text = string_format(question_array[question_index]!,this.m_number.x,this.m_number.a,"");
        this.m_pipeline.make_text(text).attach_to(this).set_position(100,40)
    }
}

class Question_4 extends QuestionView{
    private m_number : {t:number, a:number,m:number} = {t : 0, a : 0,m : 0};
    constructor(){
        super("")
    }
    public regenerate(): void {
        this.clean();

        const question_des = ["妈妈买回来一些苹果和橘子,丁丁数了数\n","一共买了{0}个","橘子的个数是苹果的{0}倍，","","橘子和苹果各有多个少？"]
        // x = t / (a + 1)
        // y = x * a
        this.m_number.a = Math.floor(Math.random() * 3 + 3);
        const apple = Math.floor(Math.random() * 12 + 8);
        const orange = this.m_number.a * apple;
        const b = Math.random() * 10;
        if(b <= 1)
        {
           this.m_number.m = 0
        }
        else if(b <= 5){
            this.m_number.m = Math.floor(Math.random() * (this.m_number.a - 1) ) + 1;

        }
        else{
            this.m_number.m = -1 * (Math.floor(Math.random() * (this.m_number.a - 1) ) + 1);
        }
        this.m_number.t = apple + orange + this.m_number.m;

        question_des[1] = string_format(question_des[1]!,this.m_number.t);
        question_des[2] = string_format(question_des[2]!,this.m_number.a);
        if(this.m_number.m > 0){
            question_des[3] = string_format("多{0}个\n",this.m_number.m);
        }
        else if(this.m_number.m < 0){
            question_des[3] = string_format("少{0}个\n",this.m_number.m);
        }

        const text = question_des.join(",");
        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20)
    }
}

class Question_5 extends QuestionView{
    private m_number : {t:number, a:number,m:number} = {t : 0, a : 0,m : 0};
    constructor(){
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
        if(b <= 1)
        {
           this.m_number.m = 0
        }
        else if(b <= 5){
            this.m_number.m = Math.floor(Math.random() * (this.m_number.a - 1) ) + 1;

        }
        else{
            this.m_number.m = -1 * (Math.floor(Math.random() * (this.m_number.a - 1) ) + 1);
        }
        this.m_number.t = apple + orange + this.m_number.m;
        let external_text = "";
        if (this.m_number.m > 0){
            external_text =string_format("多{0}个",this.m_number.m);
        } else if(this.m_number.m < 0){
            external_text =string_format("少{0}个",this.m_number.m * -1);
        }
        const question_index = Math.floor(Math.random() * question_array.length);

        const text = string_format(question_array[question_index]!,this.m_number.t,this.m_number.a,external_text)
        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20)
    }
}

class Question_6 extends QuestionView{
    private m_number : {x:number, y:number,a:number} = {x : 0, y : 0,a : 0};
    constructor(){
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
        
        const m = Math.floor(Math.random()  * ((this.m_number.a - 1) * x1 / 2 - 1) + 1);

        this.m_number.x = x1 + m;
        this.m_number.y = y1 - m;
        const question_index = Math.floor(Math.random() * question_array.length);
        const text = string_format(question_array[question_index]!, this.m_number.x,this.m_number.y,this.m_number.a);
        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20)
    }
}

class Question_7 extends QuestionView{
    private m_number : {t : number,m : number,a : number} = {t : 0,m : 0,a : 0};
    constructor(){
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
        const text = string_format(question_array[question_index]!, this.m_number.t,this.m_number.m,this.m_number.a);
        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20)
    }
}

class Question_8 extends QuestionView{
    private m_number : {t : number,m : number,a : number} = {t : 0,m : 0,a : 0};
    constructor(){
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
        const text = string_format(question_array[question_index]!, this.m_number.t,this.m_number.m,this.m_number.a);
        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20)
    }
}

class Question_9 extends QuestionView{
    private m_number : {t : number,m : number, n : number} = {t : 0,m : 0, n : 0};
    private m_segment_initializers:HorizontalSegmentInitializer[] = []
    constructor(){
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
        const text = string_format(question_array[question_index]!, this.m_number.t,this.m_number.m,this.m_number.n);
        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20)
    }

    private answer_0(){

        //this.m_pipeline.make_text("图画书").set_position();
        //this.m_pipeline.make_text("科技书").set_position();
        //this.m_pipeline.make_text("连环画").set_position();


        //
    
    }
    private answer_1(){
        // 拆分最大的那个线
        
    }
}


class Question_10 extends QuestionView{
    private m_number : {t : number,m : number,a : number, n : number,b : number} = {t : 0,m : 0,a : 0, n : 0,b : 0};
    constructor(){
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

        const str_a = this.m_number.a > 0 ? "多" + this.m_number.a + "本" :  "少" + this.m_number.a + "本"
        const str_b = this.m_number.b > 0 ? "多" + this.m_number.b + "本" :  "少" + this.m_number.b + "本"
        const question_index = Math.floor(Math.random() * question_array.length);
        const text = string_format(question_array[question_index]!, this.m_number.m,str_a,this.m_number.n ,str_b,this.m_number.t);

        this.m_pipeline.make_text(text).attach_to(this).set_position(100,20)
    }
}



class Controller extends QuestionController{
    constructor() {
        super();
        this.question_templates.push({
            template : Question_1,
            title : "简单和倍 - 1",
        },{
            template : Question_2,
            title : "简单和倍 - 2",
        },{
            template : Question_3,
            title : "简单和倍 - 3",
        },{
            template : Question_4,
            title : "简单和倍 - 4",
        },{
            template : Question_5,
            title : "简单和倍 - 5",
        },{
            template : Question_6,
            title : "简单和倍 - 6",
        },{
            template : Question_7,
            title : "简单和倍 - 7",
        },{
            template : Question_8,
            title : "简单和倍 - 8",
        },{
            template : Question_9,
            title : "简单和倍 - 9",
        },{
            template : Question_10,
            title : "简单和倍 - 10",
        });
    }
};


export const APP_Math_5_13 : QuestionTableItem = {
    category: "奥数",
    title: "和倍问题",
    creator: ()=> new Controller()
}