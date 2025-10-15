import * as PIXI from 'pixi.js';

export type SegmentPoint = {
    x : number;
    y : number;
}
export class Segment extends PIXI.Graphics{
    private point:number[] = []
    private segment_color : Map<number,string> = new Map();
    private segment_width : number = 0;
    private default_color : string = "#000000";

    private default_width : number = 2;
    constructor(point:number[]|undefined){
        super();
        if(point){
            this.point = point;
        }
        this.redraw();
    }
    private redraw(){
        this.clear();

        if(this.segment_list.length > 0){ 
            const first_point = this.segment_list[0]!;
            first_point.y -= 10;
            let color = this.segment_color.get(1) || this.default_color;

            this.lineStyle(this.segment_width, color);
            this.moveTo(first_point.x, first_point.y - 10);
            this.lineTo(first_point.x, first_point.y);
            let prev_color = color;
            for(let i = 1; i < this.segment_list.length; i++){
                const point = this.segment_list[i]!;
                if(point){

                    let color = this.segment_color.get(i) || this.default_color;
                    if (prev_color != color)
                    {
                        this.lineStyle(this.segment_width, color);
                        prev_color = color;
                    }
                    this.lineTo(point.x, point.y);
                    this.lineTo(point.x, point.y - 10);
                    this.moveTo(point.x, point.y);
                }
            }
        }
    }
}

export type HorizontalSegmentOptions = {
    point_x:number[],
    point_y:number,
    segment_color : Map<number,string>,
    default_color?:string | undefined,
    default_height? : number | undefined;
    tip_options? : Map<number,{
        text:string,
        font_size? : number | undefined,
        font_color? : string | undefined,
    }>,
}

export class HorizontalSegment extends PIXI.Container{
    private options : HorizontalSegmentOptions|null = null;
    private segment! : PIXI.Graphics;
   
    private tip: Map<number,PIXI.Container> = new Map();

    constructor(options : HorizontalSegmentOptions ){
        super();
        this.segment = new PIXI.Graphics();
        this.options = options;

        this.redraw();
    }
    private redraw(){
        this.clear();

        if(this.options == null){
            return;
        }
        
        if(this.options.point_x.length >= 2){ 
            const point_x = this.options.point_x[0]!;
            const point_y = this.options.point_y;
            let color = this.options.segment_color.get(1) || this.options.default_color;
            const default_height = this.options.default_height?this.options.default_height:2;

            this.segment.lineStyle(default_height, color);
            this.segment.moveTo(point_x, point_y - 10);
            this.segment.lineTo(point_x, point_y);
            let prev_color = color;
            for(let i = 1; i < this.options.point_x.length; i++){
                const next_point_x = this.options.point_x[i];
                if(next_point_x){
                    color = this.options.segment_color.get(i) || this.options.default_color;
                    if (prev_color != color)
                    {
                        this.lineStyle(default_height, color);
                        prev_color = color;
                    }

                    //this.moveTo(point_x, point_y);
                    this.lineTo(next_point_x, point_y);
                    this.lineTo(next_point_x, point_y - 10);
                    this.moveTo(next_point_x, point_y);

                    const tip_index = i;
                    if(this.options.tip_options){
                        if(this.options.tip_options.has(tip_index)){
                            if(!this.tip.has(tip_index)){
                                this.tip.set(tip_index,new Text());
                            }
                            const label_option = this.options.tip_options.get(tip_index)!;
                            const label = this.tip.get(tip_index);
                            if(label && label_option){
                                label.text = label_option.text;
                                label.x = 20;
                                label.y = 0
                                this.addChild(label);
                            }
                        }
                    }
                    
                    
                }
            }

        }
    }
}