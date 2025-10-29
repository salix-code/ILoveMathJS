import * as PIXI from 'pixi.js';




export type HorizontalSegmentItem = {
    width:number,
    color? : string,
    tip? : string,
    alpha? : number,
}

export type HorizontalSegmentLength = {
    range : [number,number],
    text : string,
}


export type HorizontalSegmentInitializer = {
    begin_point:{x:number,y:number},
    scale?:number,
    segments : HorizontalSegmentItem[],
    length_tip? : HorizontalSegmentLength[],
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
    },
    hide : function(index:number,options?:HorizontalSegmentInitializer){
        if(options){
            if(index >= 0 && index < options.segments.length){
                options.segments[index]!.alpha = 0;
            }
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
        const segment_range:[number,number][] = [];

        let segment_index = 0;
        this.segment.beginPath()
        let color = "white";
        for(let segment of this.initializer.segments){
            color = segment.color ?? "white";
            let need_draw = true;
            if(segment.alpha !== undefined && segment.alpha == 0){
                need_draw = false
            }
            if(need_draw){
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
            }
            

            segment_range.push([x, x + segment.width * scale]);
            x = x + segment.width * scale;
            segment_index += 1
        }

        if(this.initializer.segments.length > 1){
            this.segment.moveTo(x, y - 10).lineTo(x, y).stroke({color:color,width:1});
        } else{
            const segment = this.initializer.segments[0]!;
            if(segment.alpha === undefined || segment.alpha > 0){
                this.segment.moveTo(x, y - 10).lineTo(x, y).stroke({color:color,width:1});
            }
        }
        
        
        if(this.initializer.length_tip){
            for(let item of this.initializer.length_tip){
                let x1 = segment_range[item.range[0]]![0]!
                let x2 = segment_range[item.range[1]]![1]!

                this.segment.moveTo(x1,y + 2).lineTo(x1,y + 20).stroke({color:"#dcdcdc",width:1});
                this.segment.moveTo(x2,y + 2).lineTo(x2,y + 20).stroke({color:"#dcdcdc",width:1});

                let x3 = x1;
                while(x3 < x2){
                    this.segment.moveTo(x3,y + 10).lineTo(Math.min(x3 + 8,x2),y + 10).stroke({color:"blue",width:1});
                    x3 += 12;
                }

                const label = new PIXI.Text();
                label.text = item.text;
                label.style = {fill:'yellow', fontSize:16};
                this.addChild(label);
                label.x = (x2 - x1) / 2;
                label.y = y + 30

                
            }
        }
    }
}