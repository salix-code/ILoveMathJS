import * as PIXI from 'pixi.js';



export type HorizontalSegmentOptions = {
    point_x:number[],
    point_y:number,
    segment_color : Map<number,string>,
    default_color?:string,
    default_height? : number;
    scale ? : number;
    tip_options? : Map<number,{
        text:string,
        font_size? : number,
        font_color? : string,
    }>,
}

export class HorizontalSegment extends PIXI.Container{
    private options : HorizontalSegmentOptions|null = null;
    private segment! : PIXI.Graphics;
   
    private tip: Map<number,PIXI.Text> = new Map();

    constructor(options : HorizontalSegmentOptions ){
        super();
        
        this.options = options;

        this.redraw();
    }
    private redraw(){
        this.removeChildren();
        this.segment = new PIXI.Graphics();
        this.addChild(this.segment);
        this.tip.clear();
        
        if(this.options == null){
            return;
        }
        this.options.default_color = this.options.default_color || "white"
        
        if(this.options.point_x.length >= 2){
            const point_x = this.options.point_x[0]!;
            const point_y = this.options.point_y;
            let color = this.options.segment_color.get(1) || this.options.default_color || "white";
            const scale = this.options.scale || 1;
            const default_height = this.options.default_height?this.options.default_height:1;

            this.segment.stroke({color:color,width:1});
            
            this.segment.moveTo(point_x * scale, point_y - 10);
            this.segment.lineTo(point_x * scale, point_y);

            let prev_color = color;
            for(let i = 1; i < this.options.point_x.length; i++){
                const next_point_x = this.options.point_x[i];
                if(next_point_x){
                    color = this.options.segment_color.get(i) || this.options.default_color;
                    if (prev_color != color)
                    {
                        this.segment.stroke({color:color});
                        prev_color = color;
                    }
                    
                    this.segment.lineTo(next_point_x * scale, point_y);
                    this.segment.lineTo(next_point_x * scale, point_y - 10);
                    this.segment.moveTo(next_point_x * scale, point_y);
                    const segment_width = next_point_x * scale - this.options.point_x[i - 1]! * scale;
                    const tip_index = i;
                    if(this.options.tip_options){
                        if(this.options.tip_options.has(tip_index)){
                            if(!this.tip.has(tip_index)){
                                this.tip.set(tip_index,new PIXI.Text());
                            }
                            
                            const label_option = this.options.tip_options.get(tip_index)!;
                            const label = this.tip.get(tip_index)!;
                            if(label && label_option){
                                label.text = label_option.text;
                                const font_size = label_option.font_size || 12;
                                const font_color = label_option.font_color || 'yellow';
                                label.style = {fill:font_color, fontSize:font_size};
                                this.addChild(label);
                                label.x = this.options.point_x[i - 1]! * scale + segment_width / 2 - label.width / 2;
                                label.y = point_y - 20;
                            }
                        }
                    }
                    
                    
                }
            }

            this.segment.stroke();
            
        }
    }
}