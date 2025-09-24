import { Container, Graphics, Text,Point } from 'pixi.js';

export class Expression extends Container{
    private m_expression:string[] = [];
    private m_labels :Text[] = [];
    constructor(expression:string){
        super()
        this.m_expression = expression.trim().split(/\s+/);
        this.init_labels();
        this.redraw();
    }
    private init_labels(){
        let offset = 0;
        
        for(let text of this.m_expression){
            const label = new Text();
            label.style = { fill: 'white', fontSize: 24 };
            label.text = text;
            label.x = offset;
            label.y = 0;
            this.m_labels.push(label);
            offset = offset + label.width + 10;
        }
    }
    private redraw():void{
        //this.clear();
    
        for(let label of this.m_labels){
            this.addChild(label)
        }
        
    }
    public get_label(index:number):Text{
        if(index < 0){
            index = this.m_labels.length + index;
        }
        return this.getChildAt(index);
    }
    public remove_label(index:number){
        if(index < 0){
            index = this.m_labels.length + index;
        }
        let label = this.get_label(index)!;
        this.m_labels.splice(index,1);
        this.removeChild(label);
        this.redraw();
    }
    
}

/*
const style = new PIXI.TextStyle({ fill: 'white', fontSize: 24 });
const metrics = PIXI.TextMetrics.measureText("Hello, Pixi.js!", style);
console.log(`宽度: ${metrics.width}, 高度: ${metrics.height}`);
*/