import { Container, Graphics, Text } from 'pixi.js';

class Arrow extends Container {
    constructor() {
        super();
        
    }
};



export class Math_3_2 extends Container {
    private step: number;
    private labels:Text[] = [];

    constructor() {
        super();

        this.step = 0;

        
                //this.labels.push(text);

        
        window.addEventListener('keydown', this.onKeyDown);
    }

    run() {
        if(this.step <= 0){
            this.step = 0;
            return;
        }
        if(this.step == 1){
            if (this.labels.length == 0){
                
                let text = new Text();
                text.text = "A"
                text.style = { fill: 'white', fontSize: 24 };
                this.addChild(text);


                this.labels.push(text);
                
            }
            let text = this.labels[this.step - 1];

            if(text){
                text.x = 0
                text.y = 40
            }

        }
    }



    private onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            this.step += 1;
        } else if (e.key === 'ArrowLeft') {
            this.step -= 1;
        } else if (e.key === 'ArrowUp') {
            this.y -= 10;
        } else if (e.key === 'ArrowDown') {
            this.y += 10;
        }

        this.run();
    };
}