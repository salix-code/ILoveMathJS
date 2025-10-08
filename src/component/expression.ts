import { Container, Graphics, Text,Point } from 'pixi.js';

export type ExpressionConfig = {
    expression : string;
    x : number;
    y : number;
}

interface TextItem{
    label:Text|null,
    index : number,
}

export class Expression extends Container{
    private m_expression:string[] = [];
    private m_labels :TextItem[] = [];
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
            this.m_labels.push({
                label:label,
                index : this.m_labels.length,
            });
            offset = offset + label.width + 10;
        }
    }
    private redraw():void{
        this.clear();
    
        for(let item of this.m_labels){
            if(item.label){
                this.addChild(item.label)
            }
        }
        
    }
    private clear(){
        for(let item of this.m_labels){
            if(item.label){
                this.removeChild(item.label)
            }
        }
    }
    public get_label(index:number):Text | null{
        if(index < 0){
            index = this.m_labels.length + index;
        }
        
        return this.m_labels[index]!.label!
        
    }
    
    public remove_label(index:number){
        if(index < 0){
            index = this.m_labels.length + index;
        }
        let item = this.m_labels[index]!;
        if(item.label){
            this.removeChild(item.label!);
            item.label = null;
            this.redraw();
        }
        //this.m_labels.splice(index,1);
        
    }

    public change_label_color(index:number,color:string){
        if(index >= 0 && index < this.m_labels.length){
            let item = this.m_labels[index];
            if(item && item.label){
                item.label.style.fill = color;
            }
        }
        
        
    }
    
}

/*
const style = new PIXI.TextStyle({ fill: 'white', fontSize: 24 });
const metrics = PIXI.TextMetrics.measureText("Hello, Pixi.js!", style);
console.log(`宽度: ${metrics.width}, 高度: ${metrics.height}`);
*/