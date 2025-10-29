import { Container,Text} from 'pixi.js';
import { AnimationSystem } from '../class/anim';
import { Expression } from '../component/expression';
import { Arrow, type ArrowInitializer } from '../component/arrow';
import { Line } from '../component/line';
import { HorizontalSegment, type HorizontalSegmentInitializer } from '../component/segment';
import { QuestionGraph, type QuestionGraphConstructor } from '../component/questionngraph';
import { VerticalListText, type VerticalListTextInitializer } from '../component/listtext';

export interface PipelineContext{
    view:Map<string,Container>;
}


export class Pipeline{
    private context:PipelineContext;

    private m_slots:string[] = [];
    private current :Container | null = null;

    constructor(){
        this.context = {} as PipelineContext;
        this.context.view = new Map();
    }
    public clone(input:Container,parent?:Container):Pipeline{
        if(input instanceof Text){
            const target = this.clone_text(input as Text);
            if(parent){
                let point = input.getGlobalPosition();
                point = parent.toLocal(point);
                target.position = point
                parent.addChild(target);
            }
            this.save_view(target);
        }
        return this;
    }
    public create<T extends new (...args: any[]) => Container>(ctor:T,...args: ConstructorParameters<T>){
        const output = new ctor(...args);
        
        this.save_view(output);
        
        return this;
    }

    public use(input:Container){
        if(this.m_slots.length > 0){
            const tag = this.m_slots[this.m_slots.length - 1]!;
            this.context.view.set(tag,input);
        }
        return this;
    }

    public create_expression(expression:string,x:number,y:number){
        const label = new Expression(expression);
        label.x = x;
        label.y = y;
        this.save_view(label);
        return this;
    }
    protected get_view():Container | null{
        if (this.m_slots.length > 0){
            const tag = this.m_slots[this.m_slots.length - 1]!;

            return this.context.view.get(tag)!;
        }
        return this.current;
        
    }
    public get_view_by_tag(tag:string):Container|any{
        return this.context.view.get(tag)!;
    }

    protected save_view(view:Container){
        if(this.m_slots.length > 0){
            const tag = this.m_slots[this.m_slots.length - 1]!;
            this.context.view.set(tag,view);
        }
        this.current = view;
    }
    

    public set_position(x:number,y:number){
        const view = this.get_view();
        if(view){
            view.x = x;
            view.y = y;
        }
        return this;
    }

    public push_slot(tag:string){
        this.m_slots.push(tag);
        return this;
    }
    public pop_slot(){
        let tag = this.m_slots.pop()!;

        return this;
    }
    public tag(input:string){
        if (this.current){
            this.context.view.set(input,this.current!);
            this.current = null;
        }

    }

    public attach_to(stage:Container|null){
        const view = this.get_view();
        
        if(view && stage){
            stage.addChild(view);
        }
        
        return this;
    }
    public move_to(x:number,y:number):Pipeline{
        const view = this.get_view();

         if(view){
            AnimationSystem.getInstance().move_to(view,x,y,2);
        }
        
        return this;
    }
    public move_to_view(target:Container,cb?:()=>void){
        const anim_view = this.get_view();
        if(anim_view){
            if(anim_view.parent == target.parent){
                let point = target.position
                AnimationSystem.getInstance().move_to(anim_view,point.x,point.y,2);
            }
            else if(anim_view.parent){
                
                let point = target.getGlobalPosition();
                point = anim_view.parent.toLocal(point);
                AnimationSystem.getInstance().move_to(anim_view,point.x,point.y,2,cb);
            }
        }

        return this;
    }
    public set_property(name:string,value:any){
        let label = this.get_view()!;
        if(name in label){
           //label[name] = value;
        }
    }

    public make_text(text:string,font_size?:number,color? : string){
        font_size = font_size || 24;
        color = color || 'white'
        const label = new Text({
            text: text,
            style: {fill:color, fontSize:font_size}});
        this.save_view(label);
        return this;
    }
    
    public make_vertical_line(x:number,y : number,length:number){
        let line = new Line(x,y,x,y + length);
        this.current = line
        return this
        
    }

    public make_horiaontal_line(x:number,y : number,length : number){
        let line = new Line(x,y,x + length,y);
        this.current = line
        return this
    }

    public make_horiaontal_segment(optios:HorizontalSegmentInitializer){
        if (!optios) {
            return this;
        }
        
        const segment = new HorizontalSegment(optios);
        this.current = segment;
        return this;
    }
    public make_vertical_text(initializer : VerticalListTextInitializer){
        const result = new VerticalListText(initializer);

        this.current = result;
        return this;
    }

    // public make_arrow(from:Container|string,target:Container|string,parent:Container){
    //     let from_label:Container;
    //     let target_label:Container;
    //     if (typeof from == "string"){
    //         from_label = this.get_view_by_tag(from)!;
    //     }
    //     else{
    //         from_label = from as Container;
    //     }
    //     if (typeof target == "string"){
    //         target_label = this.get_view_by_tag(target)!;
    //     }
    //     else{
    //         target_label = target as Container;
    //     }
    //     let from_point = from_label.getGlobalPosition();
    //     from_point = parent.toLocal(from_point);
    //     let target_point = target_label.getGlobalPosition();
    //     target_point = parent.toLocal(target_point);
    //     if(target_point.y > from_point.y){
    //         from_point.y += from_label.height;
    //         if(target_point.x > from_point.x + from_label.width){
    //             from_point.x += from_label.width;
    //         }
    //         else if(target_point.x + target_label.width > from_point.x){
    //             from_point.x += from_label.width / 2;
    //         }
    //         else{
                
    //         }
    //         target_point.x += target_label.width / 2;
    //     }
    //     const arrow = new Arrow(from_point.x,from_point.y,target_point.x,target_point.y);
    //     parent.addChild(arrow);
    //     this.save_view(arrow);
    //     return this;
    // }

    public make_arrow(from:string,target:string,parent:Container,initializer:ArrowInitializer){

        let from_label:Container = this.get_view_by_tag(from)!;;
        let target_label:Container = this.get_view_by_tag(target)!;

        let from_point = from_label.getGlobalPosition();
        from_point = parent.toLocal(from_point);

        initializer.start_point.point.x = from_point.x;
        initializer.start_point.point.y = from_point.y;
        initializer.start_point.size = {width:from_label.width,height:from_label.height};
        
        let target_point = target_label.getGlobalPosition();
        target_point = parent.toLocal(target_point);

        initializer.end_point.point.x = target_point.x;
        initializer.end_point.point.y = target_point.y;
        initializer.end_point.size = {width:from_label.width,height:from_label.height};
        
        this.create_arrow(initializer)
        parent.addChild(this.current!);
        return this;
    }

    public make_question_graph(initializer:any){
        let result = new QuestionGraph(initializer as QuestionGraphConstructor);
        this.current  = result;
        return this;
    }

    public create_arrow(initializer:ArrowInitializer){
        const arrow = new Arrow(initializer);
        this.current = arrow;
        return this;
    }

    public redraw(...tags:string[]){
        for(let tag of tags){
            const view = this.get_view_by_tag(tag);
            if(view){
                if (typeof view["redraw"] === "function") {
                    view["redraw"]();
                }
            }
        }
    }

    
    private clone_text(input:Text){
        const view = new Text();
        view.style = input.style;
        view.text = input.text;
        //this.context.anim_view.
        return view;
    }
}