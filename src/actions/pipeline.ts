import { Container,Text} from 'pixi.js';
import { AnimationSystem } from '../class/anim';
import { Expression } from '../component/expression';

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
    public clone(input:Container):Pipeline{
        if(input instanceof Text){
            return this.clone_text(input as Text);
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
    }

    public create_expression(expression:string,x:number,y:number){
        const label = new Expression(expression);
        label.x = x;
        label.y = y;
        return this;
    }
    protected get_view():Container{
        const tag = this.m_slots[this.m_slots.length - 1]!;
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
        this.m_slots.pop();
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
    private clone_text(input:Text):Pipeline{
        const view = new Text();
        view.style = input.style;
        view.text = input.text;
        if(this.m_slots.length > 0){
            const tag = this.m_slots[this.m_slots.length - 1]!;
            this.context.view.set(tag,view);
        }
        //this.context.anim_view.
        return this;
    }
}