import { Container,Text} from 'pixi.js';
import { AnimationSystem } from '../class/anim';
import { Expression } from '../component/expression';
import { Arrow } from '../component/arrow';

export interface PipelineContext{
    view:Map<string,Container>;
}


export class Pipeline{
    private context:PipelineContext;

    private m_slots:string[] = [];
    
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
    protected get_view():Container{
        const tag = this.m_slots[this.m_slots.length - 1]!;
        return this.context.view.get(tag)!;
    }
    public get_view_by_tag(tag:string):Container|undefined{
        return this.context.view.get(tag);
    }

    protected save_view(view:Container){
        if(this.m_slots.length > 0){
            const tag = this.m_slots[this.m_slots.length - 1]!;
            this.context.view.set(tag,view);
        }
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

    public attach_to(stage:Container){
        if(this.m_slots.length > 0){
            const tag = this.m_slots[this.m_slots.length - 1]!;
            const view = this.context.view.get(tag)!;
            if(view){
                stage.addChild(view);
            }
        }
        return this;
    }
    public move_to(x:number,y:number):Pipeline{
        if(this.m_slots.length > 0){
            const tag = this.m_slots[this.m_slots.length - 1]!;
            const view = this.context.view.get(tag)!;
            if(view){
                AnimationSystem.getInstance().move_to(view,x,y,2);
            }
        }
        
        return this;
    }
    public move_to_view(target:Container,cb?:()=>void){
        if(this.m_slots.length > 0){
            const tag = this.m_slots[this.m_slots.length - 1]!;
            const anim_view = this.context.view.get(tag)!;
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
        }

        return this;
    }
    public set_property(name:string,value:any){
        let label = this.get_view();
        if(name in label){
           //label[name] = value;
        }
    }

    public make_arrow(from:Container,target:Container,parent:Container){
        let from_point = from.getGlobalPosition();
        from_point = parent.toLocal(from_point);
        let target_point = target.getGlobalPosition();
        target_point = parent.toLocal(target_point);
        if(target_point.y > from_point.y){
            from_point.y += from.height;
            if(target_point.x > from_point.x + from.width){
                from_point.x += from.width;
            }
            else if(target_point.x + target.width > from_point.x){
                from_point.x += from.width / 2;
            }
            else{
                
            }

            target_point.x += target.width / 2;
        }
        const arrow = new Arrow(from_point.x,from_point.y,target_point.x,target_point.y);
        parent.addChild(arrow);
        this.save_view(arrow);
        return this;
    }

    
    private clone_text(input:Text){
        const view = new Text();
        view.style = input.style;
        view.text = input.text;
        //this.context.anim_view.
        return view;
    }
}