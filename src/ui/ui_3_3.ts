import { Container, Graphics, Text,Point } from 'pixi.js';
import { Line } from '../component/line';

import { type AnimationItem,type AnimationData ,AnimationSystem} from "../component/anim";

function format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => args[index]);
}

class Question extends Container{
    protected answer_index : number = 0;
    protected step_direction : number = 0;



    protected created_labes : Text[] = [];

    protected animation_system : AnimationSystem = new AnimationSystem();
    
    constructor(title:string){
        super()
        const title_label = new Text()
        title_label.style = { fill: 'white', fontSize: 24 };
        title_label.text = title
        title_label.x = 300;
        title_label.y = 20;
        this.addChild(title_label)

    }
    public step(d: number): void {
        this.draw(d);
    }
    protected draw(step_direction:number): void{
        
    }
    public regenerate():void{}

    public tick(deltaTime:number):void{
        this.tick_animation(deltaTime);
    }
    public tick_animation(deltaTime:number):void{
        this.animation_system.tick(deltaTime);
    }
    public is_playing_anim() :boolean{
        return this.animation_system.is_playing_anim();
    }
    
}

class Question_1 extends Question{
    private labels:Text[] = [];
    private random_number : number = 0;
    private number_list : number[] = [];
    constructor(title:string, number_list : number[] = [2,5]) {
        super(title)
        this.number_list = number_list;
        this.init_random_number();
        this.init_ui();
    }

    private init_random_number(): void{
        this.random_number = Math.floor(Math.random() * 9999) + 1;

    }
    private init_ui(): void{
        const text = this.get_or_create_if_not_exists(0);
        text.text = this.generate_text();
        this.addChild(text);
        this.labels.push(text);
    }

    public regenerate():void{
        this.clear_ui();
        this.init_random_number();
        this.init_ui();
    }
    private clear_ui(): void{
        for(const label of this.labels){
            this.removeChild(label);
        }
        for(const label of this.created_labes){
            this.removeChild(label);
        }
        this.created_labes = [];
        this.labels = [];
        this.answer_index = 0;
        
    }

    private generate_text(isRandom: boolean = true): string{
        if(this.number_list.length <= 1){
            return "";
        }
        let insert_index = this.number_list.length;
        if(isRandom == true){
            insert_index = Math.floor(Math.random() * (this.number_list.length));
        }
        
        let result = "";
        if(insert_index == 0){
            result += this.random_number;
            result += " x " + this.number_list[0];
        }
        else{
            result += this.number_list[0];
        }
        for(let i = 1; i < this.number_list.length; i++){
            if(i == insert_index){
                result +=" x " + this.random_number;
            }
            result +=" x " + this.number_list[0];
        }
        if(insert_index == this.number_list.length){
            result +=" x " + this.random_number;
        }
        return result;
    }

    private get_or_create_if_not_exists(index:number): Text{
        if(this.labels.length > index){
            return this.labels[index]!;
        }
        let label = new Text();
        label.style = { fill: 'white', fontSize: 24 };
        this.labels.push(label);
        return label
    }

    protected draw(step_direction:number): void{
        if (this.answer_index == 0){
            if(step_direction == 1){
                let label = this.get_or_create_if_not_exists(1);
                label.text = this.generate_text(false);
                label.x = 100;
                label.y = 60;
                this.addChild(label);
                label = this.get_or_create_if_not_exists(2);
                label.text = "交换位置";
                label.x = 200;
                label.y = 60;
                this.addChild(label);
                
            }
            else if(step_direction == -1){

            }
        }
        else if(this.answer_index == 1){
            if(step_direction == 1){
                const label = this.get_or_create_if_not_exists(3);
                let acc = 1;
                for(const n of this.number_list){
                    acc *= n;
                }
                label.text = format("= {0} x {1}", acc , this.random_number);
                label.x = 100;
                label.y = 60;
                this.addChild(label);
                
            }else if(step_direction == -1){
                let label = this.get_or_create_if_not_exists(1);
                this.removeChild(label);
                label = this.get_or_create_if_not_exists(2);
                this.removeChild(label);

            }
        }
        else if(this.answer_index == 1){
            if(step_direction == 1){
                const label = this.get_or_create_if_not_exists(4);
                let acc = 1;
                for(const n of this.number_list){
                    acc *= n;
                }
                label.text = "= " + (acc * this.random_number).toString();
                this.addChild(label);
                label.x = 100;
                label.y = 120;
            }
        }
    }
}

/**
 * 0 1
 * 2 3
 * 4 5
 * 6 7
 * 9 8
 */

// m * n
class Multiply extends Container{
    private labels:Text[] = [];
    private number_layer : number[] = [];
    private label_layer_count : number[] = [];
    private flag_label! : Text;
    private line : Line[] = [];

    public is_finished : boolean = false;


    constructor(m:number,n:number) {
        super();
        this.init_number(m,n);
        this.start();
    }
    private create_number_text():Text{
        let label = new Text();
        label.style = { fill: 'white', fontSize: 24 };
        this.labels.push(label);  
        return label;  
    }
    
    private init_number(m:number,n:number) : void{
        this.number_layer = [];
        this.number_layer.push(m,n);
        let x = n;
        while(x > 0){
            this.number_layer.push((x % 10) * m);
            x = Math.floor(x/10);
        }
        
        this.number_layer.push(m * n);
    }
    
    private start(): void{
        this.create_layer(this.number_layer[0]!,0);
        this.create_layer(this.number_layer[1]!,1);
        this.flag_label = new Text();
        this.flag_label.style = { fill: 'white', fontSize: 24 };
        this.flag_label.text = "X";
        this.flag_label.x = 320;
        this.flag_label.y = 90;
        this.addChild(this.flag_label);
        this.line[0] = new Line(300, 120, 480, 120);
        this.addChild(this.line[0]!);
    }

    private create_layer(num:number,layer_index : number): void{
        let count = 0;
        let x_offset = 0;
        if (layer_index > 2 && layer_index != this.number_layer.length - 1){
            x_offset = (layer_index - 2) * 25;
        }
        while(num > 0){
            const x = num % 10;
            const label = this.create_number_text();
            label.text = x.toString();
            label.x = 400 - count * 24 - x_offset;
            label.y = 60 + 30 * layer_index;
            this.addChild(label);
            num = Math.floor(num / 10);
            count += 1;
        }
        this.label_layer_count.push(count);
    }
    private clean_ui(): void{
        for(const label of this.labels){
            this.removeChild(label);
        }
        this.labels = [];
        for(const l of this.line){
            this.removeChild(l);
        }
        this.line = [];
        this.label_layer_count = [];
        this.is_finished = false;
    }
    public regenerate(m:number,n:number): void {
        this.clean_ui();
        this.init_number(m,n)
        this.start();
    }
    public draw(step_direction: number): void {
        if(step_direction == 1){
            let layer_index = this.label_layer_count.length;
            if(layer_index < this.number_layer.length){
                if(layer_index == this.number_layer.length - 1){
                    let height_offset = (this.number_layer.length - 3) * 30 + 120;
                    this.line[1] = new Line(300, height_offset, 480, height_offset);
                    this.addChild(this.line[1]);
                    this.is_finished = true;
                }
                this.create_layer(this.number_layer[layer_index]!,layer_index);
            }
        }
        else if(step_direction == -1){
            let layer_index = this.label_layer_count.length - 1;
            if (layer_index > 1){
                if(layer_index < this.number_layer.length){
                    if(layer_index == this.number_layer.length - 1){
                        this.removeChild(this.line[1]!);
                        this.line.pop();
                    }
                    this.is_finished = false;
                    let count = this.label_layer_count.pop();
                    while(count! > 0 && this.labels.length > 0){
                        const label = this.labels.pop();
                        this.removeChild(label!);
                        count!--;
                    }
                }
            }
           
        }
    }

    public get_result_layer_index():number{
        return this.number_layer.length - 1;
    }
    public get_label_count(layer_index:number){
        return this.label_layer_count[layer_index];
    }
    public set_text_color(layer_index:number,label_index:number,color_name:string):void{
        const label = this.get_label(layer_index,label_index);
        label.style = {'fill':color_name};
    }

    public get_label(layer_index:number,label_index:number):Text{
        let offset_index = 0;
        for(let i = 0; i < layer_index; ++i){
            offset_index += this.label_layer_count[i]!;
        }

        const label = this.labels[offset_index + label_index]!;
        return label;
    }
    
}

class Multiply_11 extends Question{
    private view! : Multiply;
    private first_number : number = 0;
    constructor(title:string){
        super(title)
        let [m,n] = this.generate_initialize_number();
        this.first_number = m
        this.view = new Multiply(m,n)
        this.addChild(this.view);
    }
    protected draw(step_direction: number): void {
        if(this.view.is_finished){
            if(step_direction == 1){
                const result_layer_index = this.view.get_result_layer_index();
                const result_layer_count = this.view.get_label_count(result_layer_index)!;
                
                if(this.answer_index == 0){
                    this.view.set_text_color(0,0,'yellow');
                    this.view.set_text_color(4,0,'yellow');

                    let label = this.view.get_label(4,0);
                    let clone_label = this.clone_label(label);
                    
                    this.move_to(clone_label,clone_label.x,clone_label.y + 60,3);
                    const target_y = clone_label.y + 60;
                    
                    label = this.view.get_label(0,0);
                    clone_label = this.clone_label(label);
                    this.move_to(clone_label,clone_label.x + 60,target_y,2);
                    label = new Text();
                    label.text = "="
                    label.x = clone_label.x + 20;
                    label.y = target_y;
                    this.created_labes.push(label);
                    this.addChild(label);
                }

                else if(this.answer_index == result_layer_count - 1){

                    let label = this.view.get_label(4,2);
                    let clone_label = this.clone_label(label);
                    const target_y = clone_label.y + 120 ;
                    this.move_to(clone_label,clone_label.x,target_y,2);

                    label = this.view.get_label(0,1);
                    clone_label = this.clone_label(label);
                    this.move_to(clone_label,clone_label.x + 60,target_y,2);

                    label = new Text();
                    label.text = "="
                    label.x = clone_label.x + 20;
                    label.y = target_y;
                    this.created_labes.push(label);
                    this.addChild(label);

                }
                else if(this.answer_index < result_layer_count - 1){
                    
                    const result_layer_index = this.view.get_result_layer_index();

                    let label = this.view.get_label(result_layer_index,this.answer_index);
                    let clone_label = this.clone_label(label);
                    let target_y = clone_label.y + 90 ;
                    let begin_x = clone_label.x;
                    this.move_to(clone_label,begin_x,target_y,2);

                    label = this.view.get_label(0,this.answer_index - 1);
                    clone_label = this.clone_label(label);
                    const m : number = Number(clone_label.text);
                    target_y = clone_label.y + 90 ;
                    this.move_to(clone_label,begin_x + 20,target_y,2);

                    label = new Text();
                    label.text = "+"
                    label.style.fill = "white";
                    label.x = begin_x + 40;
                    label.y = target_y;
                    this.addChild(label);
                    this.created_labes.push(label);

                    label = this.view.get_label(0,this.answer_index);
                    clone_label = this.clone_label(label);
                    const n : number = Number(clone_label.text);
                    target_y = clone_label.y + 90 ;
                    this.move_to(clone_label,begin_x + 60,target_y,2);

                    label = new Text();
                    label.text = "="
                    label.style.fill = "white";
                    label.x = begin_x + 80;
                    label.y = target_y;
                    this.addChild(label);
                    this.created_labes.push(label);

                    begin_x = begin_x + 100
                    let r = m + n;
                    while(r > 0){
                        const x = r % 10;

                        label = new Text();
                        label.text = "+"
                        label.style.fill = "white";
                        label.x = begin_x + 20;
                        label.y = target_y;
                        this.addChild(label);
                        this.created_labes.push(label);

                        label = new Text();
                        label.text = x + ""
                        label.style.fill = "white";
                        label.x = begin_x + 40;
                        label.y = target_y;
                        this.addChild(label);
                        this.created_labes.push(label);

                        r = Math.floor(r / 10);

                        begin_x += 40;
                    }

                    //
                }

                this.answer_index = Math.min(this.answer_index + 1,3);
            }
            else{
                
            }
            
        }
        else{
            this.view.draw(step_direction);
        }
    }
   
    public regenerate(): void {
        let [m,n] = this.generate_initialize_number();
        this.view.regenerate(m,n);
        this.answer_index = 0;
    }

    protected generate_initialize_number():[number,number]{
        return [0,0];
    }

    public clone_label(src_label:Text):Text{
        let label = new Text();
        label.style = src_label.style;
        label.text = src_label.text;
        let position:Point = src_label.getGlobalPosition();
    
        label.position = this.toLocal(position,this);
        this.addChild(label);
        this.created_labes.push(label);
        return label;
    }
    public move_to(src_widget:Text,x:number,y:number,seconds:number):void{
        this.animation_system.move_to(src_widget,x,y,seconds);
    }


}

class Question_2 extends Multiply_11{
    
    protected generate_initialize_number() : [number,number]{

        let m = Math.floor(Math.random() * 9) + 1; // [1,9]
        let n = Math.floor(Math.random() * (10 - m)) ;
        return [m * 10 + n,11]
    }
}

class Question_3 extends Multiply_11{
    
    protected generate_initialize_number() : [number,number]{

        let m = Math.floor(Math.random() * 88) + 12; // [11,99]
        
        return [m ,11]
    }
}


class Question_4 extends Multiply_11{
    
    protected generate_initialize_number() : [number,number]{

        let m = Math.floor(Math.random() * 888) + 112; // [111,999]
        
        return [m ,11]
    }
}


export class Math_3_3 extends Container {
    private question!:Question;
    private question_index: number = 0;
    constructor(x : number,y:number) {
        super();
        
        window.addEventListener('keydown', this.onKeyDown);
    }
    private step_question(direction : number){
        if(this.question != null){   
            this.removeChild(this.question);
        }
        this.create_question();
    }
    private step_answer(direction:number){
        if(this.question != null){
            this.question.step(direction);
        }
    }
    public tick(delta: number):void{
        if(this.question != null){
            this.question.tick(delta);
        }
    }

    private create_question(){
        if(this.question_index == 1){
            this.question = new Question_1("乘法的交换律");
            this.addChild(this.question)
        }
        else if(this.question_index == 2){
            this.question = new Question_2("乘法的小技巧 X 11");
            this.addChild(this.question)
        }
        else if(this.question_index == 3){
            this.question = new Question_3("乘法的小技巧 X 11");
            this.addChild(this.question)
        }
        else if(this.question_index == 4){
            this.question = new Question_4("乘法的小技巧 X 11");
            this.addChild(this.question)
        }

    }
    private regenerated(){
        if(this.question != null){
            this.question.regenerate();
        }
    }

    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            this.step_answer(1);
        } else if (e.key === 'ArrowLeft') {
            this.step_answer(-1);
        } else if (e.key === 'ArrowUp') {
            this.step_question(1)

        } else if (e.key === 'ArrowDown') {
            this.question_index += 1;
            this.step_question(-1);
        }
        else if (e.key === '`'){
            this.regenerated();
        }
    }
}