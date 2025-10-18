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
        this.segment.clear();
        this.addChild(this.segment);

        if(this.initializer.segments.length == 0){
            return;
        }

        const scale = this.initializer.scale??1;
        
        let x = this.initializer.begin_point.x * scale;
        const y = this.initializer.begin_point.y
        
        let segment_index = 0;
        this.segment.beginPath()
        let color = "white";
        for(let segment of this.initializer.segments){
            color = segment.color ?? "white";
            
            this.segment.moveTo(x, y - 10)
                .lineTo(x,y)
                .lineTo(x + segment.width * scale,y)
                .stroke({color:color,width:1});
            
            if(segment.tip){
                let label = this.tip.get(segment_index)!;
                if(!label){
                    label = new PIXI.Text()
                    this.tip.set(segment_index,label);
                }
                if(label){
                    label.text = segment.tip;
                    const font_size =  12;
                    const font_color = 'yellow';
                    label.style = {fill:font_color, fontSize:font_size};
                    this.addChild(label);
                    label.x = x + segment.width * scale / 2 - label.width / 2;
                    label.y = y - 20;
                }
            }
            x = x + segment.width * scale;
            segment_index += 1
        }
        this.segment.moveTo(x, y - 10).lineTo(x, y).stroke({color:color,width:1});
        
    }
}