import { Container, Graphics, Text } from 'pixi.js';
import { Arrow } from '../component/arrow';

interface Question {
    step(d:number):void;
}


class Question_1 extends Container implements Question{
    private step_num : number;
    private draw_step  : number;
    private label :Text;
    private sequare : Graphics;
    private arrow:Graphics;

    constructor(){
        super();
        this.step_num = 0;
        this.draw_step = 0;
        this.label = new Text();
        this.label.text = "A"
        this.label.style = { fill: 'white', fontSize: 24 };
        
        this.sequare = new Graphics()
            .rect(0, 0, 100, 100)
            .fill({ color: 0xff0000 }) // Fill with red
        
        this.arrow = new Arrow(0, 0, 50, 50, 
                { color: 0xff0000, width: 2, headLength: 20 });
                
    }

    step(d:number){
        this.step_num = this.step_num + d;
        if(this.step_num < 0){
            this.step_num = 0
        }
        if(this.step_num > 5){
            this.step_num = 5
        }
        this.draw()
    }

    draw(){
        if(this.step_num == this.draw_step){
            return;
        }
        this.draw_step = this.step_num

        if(this.draw_step == 1){
            this.addChild(this.label)
            this.addChild(this.sequare)
        }
        else if(this.draw_step == 2){
            this.addChild(this.arrow)
        }
        else if(this.draw_step == 3){
            this.removeChild(this.arrow)
            this.label.x = 0;
        }
        else if(this.draw_step == 4){
            this.label.x = 0;
            this.addChild(this.arrow);
        }
        else if(this.draw_step == 5){
            this.removeChild(this.arrow)
        }
    }
}

class Question_2 extends Container implements Question{
    private answer_index : number = 0;
    private step_direction : number = 0;

    private labels :Text[] = [];
    private sequares : Graphics[] = [];
    private arrows :Graphics[] = [];

    constructor(){
        super()

        for(let i = 0; i < 4; ++i){
            let label = new Text().style({ fill: 'white', fontSize: 24 });
            label.text = ('A' + i)
            
            let sequare = new Graphics()
                .rect(0, 0, 100, 100)
                .fill({ color: 0xff0000 }) // Fill with red
            
            let arrow = new Arrow(0, 0, 50, 50, 
                    { color: 0xff0000, width: 2, headLength: 20 });
            
            this.labels.push(label);
            this.sequares.push(sequare);
            this.arrows.push(arrow);
        }
    }
    step(d: number): void {
        this.step_direction = d;
        this.draw()
    }
    draw(){
        if (this.step_direction == 0){
            return;
        }
        if (this.answer_index == 0){
            if(this.step_direction == 1){
                for(let i = 0; i < 2; ++i){
                    this.addChild(this.labels[i]);
                    this.addChild(this.sequares[i]);
                }
            }
            else{
                this.step_direction = 0;
            }
        }
        else if(this.answer_index == 1){
            if(this.step_direction == 1){
                for(let i = 0; i < 2; ++i){
                    this.addChild(this.arrows[i])
                }
                for(let i = 0; i < 2; ++i){
                    this.addChild(this.labels[i + 2]);
                    this.addChild(this.sequares[i + 2]);
                    this.addChild(this.arrows[i + 2])
                }
            }
            else if(this.step_direction == -1){

            }
        }
        else if(this.answer_index == 2){
            if(this.step_direction == 1){
                this.step_direction = 0;
            }
            else{
                for(let i = 0; i < 2; ++i){
                    this.removeChild(this.arrows[i])
                }
                for(let i = 0; i < 2; ++i){
                    this.removeChild(this.labels[i + 2]);
                    this.removeChild(this.sequares[i + 2]);
                    this.removeChild(this.arrows[i + 2])
                }
            }
        }
        this.answer_index += this.step_direction;
        this.step_direction = 0;
    }
}

class Question_3 extends Container implements Question{
    private answer_index : number = 0;
    private step_direction : number = 0;

    constructor(){
        super()
        let title = new Text().style({ fill: 'white', fontSize: 24 });
        title.text = "把ABC三个字母放在四个方框里"

        this.addChild(tltle)

    }
    step(d: number): void {
        this.step_direction = d;
        this.draw()
    }
    draw(): void{

    }
}

export class Math_3_2 extends Container {
    private question_index: number;
    private question!: Question;
    private begin_x:number;
    private begin_y:number;

    constructor(x : number,y:number) {
        super();
        this.question_index = 0; 
        this.begin_x = x;
        this.begin_y = y;
        window.addEventListener('keydown', this.onKeyDown);
    }

    
    run() {
        
    }
    next_question(){
        if(this.question != null){
            
            this.removeChild(this.question);
        }
        this.create_question();

    }
    create_question(){
        if(this.question_index == 1){
            this.question = new Question_1();
            
            this.addChild(this.question)
        }
    }
    draw_answer(direction:number){
        if(this.question != null){
            this.question.step(direction);
        }
    }


    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            this.draw_answer(1);
        } else if (e.key === 'ArrowLeft') {
            this.draw_answer(-1);
        } else if (e.key === 'ArrowUp') {
            this.question_index -= 1;
            this.next_question()

        } else if (e.key === 'ArrowDown') {
            this.question_index += 1;
            this.next_question()
        }

        this.run();
    };
}