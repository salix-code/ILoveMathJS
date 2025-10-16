import * as PIXI from 'pixi.js';




export type HorizontalSegmentItem = {
    width:number,
    color? : string,
    tip? : string,
}

export type HorizontalSegmentInitializer = {
    begin_point:{x:number,y:number},
    scale?:number,
    segments : HorizontalSegmentItem[]
}

export const HorizontalSegmentOperator = {
    insert : function(index : number,x : HorizontalSegmentItem,options? : HorizontalSegmentInitializer){
        if(options){
            options.segments.splice(index,0,x);            
        }
    },
    remove : function(index : number, options? :HorizontalSegmentInitializer){
        if(options){
            options.segments.splice(index,1);
        }
    }
}

export class HorizontalSegment extends PIXI.Container{
    private initializer! : HorizontalSegmentInitializer;
    private segment! : PIXI.Graphics;
    private tip: Map<number,PIXI.Text> = new Map();

    constructor(initializer : HorizontalSegmentInitializer ){
        super();
        
        this.initializer = initializer;
        this.segment = new PIXI.Graphics();
        this.addChild(this.segment);
        this.redraw();
    }
    private redraw(){
        this.removeChildren();
        this.addChild(this.segment);

        if(this.initializer.segments.length == 0){
            return;
        }
        
        let x = this.initializer.begin_point.x;
        const y = this.initializer.begin_point.y
        const scale = this.initializer.scale??1;
        let segment_index = 0;
        for(let segment of this.initializer.segments){
            const color = segment.color??"white";
            this.segment.stroke({color:color,width:1});

            this.segment.moveTo(x, y - 10);
            this.segment.lineTo(x, y);
            this.segment.lineTo(x + segment.width, y);
            
            if(segment.tip){
                let label = this.tip.get(segment_index)!;
                if(!label){
                    label = new new PIXI.Text()
                    this.tip.set(segment_index,label);
                }
                if(label){
                    label.text = segment.tip;
                    const font_size =  12;
                    const font_color = 'yellow';
                    label.style = {fill:font_color, fontSize:font_size};
                    this.addChild(label);
                    label.x = x + segment.width / 2 - label.width / 2;
                    label.y = y - 20;
                }
            }

            x = x + segment.width;
            segment_index += 1
        }

        this.segment.moveTo(x, y - 10);
        this.segment.lineTo(x, y);
        
        
    }
}