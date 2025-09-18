import { Container, Graphics, Text } from 'pixi.js';

function format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => args[index]);
}

class Question extends Container{
    protected answer_index : number = 0;
    protected step_direction : number = 0;
    
    constructor(title:string){
        super()
        const title_label = new Text()
        title_label.style = { fill: 'white', fontSize: 24 };
        title_label.text = title
        title_label.x = 100;
        title_label.y = 20;
        this.addChild(title_label)

    }
    public step(d: number): void {
        
        this.draw(d);
        this.answer_index += d;
    }
    protected draw(step_direction:number): void{
        
    }
    public regenerate():void{}
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


class Question_2 extends Question{
    private labels:Text[] = [];
    private number_count : number = 0;
    private number_list : number[] = [];

    constructor(title:string) {
        super(title)
        this.number_count = 2;
        this.init_number();
        const label_count = (this.number_count + 1) * 4;
        for(let i = 0; i < label_count; i++){
            let label = new Text();
            label.style = { fill: 'white', fontSize: 24 };
            this.labels.push(label);    
        }
        this.init_ui();
    }
    private init_number() : void{
        let total = Math.floor(Math.random() * 9) + 1;
        this.number_list.push(total); // 1-9
        for(let i = 1; i < this.number_count; i++){
            this.number_list.push(Math.floor(Math.random() * 10)) // 0 - 9
            total = total * 10 + this.number_list[i]!;
        }
        this.number_list.push(1);
        this.number_list.push(1);
        for(let i = 0; i < this.number_count; i++){
            this.number_list.push(this.number_list[i]!);
        }
        for(let i = 0; i < this.number_count; i++){
            this.number_list.push(this.number_list[i]!);
        }
        while(total != 0){
            this.number_list.push(total % 10);
            total = Math.floor(total / 10);
        }
    }
    private init_ui(): void{
        for(let i = 0; i < this.number_count; ++i){
            let label = this.labels[i];
            label.text = this.number_list[i]!.toString();
            label.x = 100 + i * 30;
            label.y = 20;
            this.addChild(label);
        }
        for(let i = 0; i < 2; ++i){
            let label = this.labels[this.number_count + i];
            label.text = this.number_list[i]!.toString();
            label.x = 100 + i * 30;
            label.y = 20;
            this.addChild(label);
        }
        
    }
    private clean_ui(): void{
        for(const label of this.labels){
            this.removeChild(label);
        }
    }
    public regenerate(): void {
        
    }
    protected draw(step_direction: number): void {
        
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

    private create_question(){
        if(this.question_index == 1){
            this.question = new Question_1("乘法的交换律");
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