import { Container,Text} from 'pixi.js';
import { AnimationSystem } from '../component/anim';

export interface PipelineContext{
    view:Map<string,Container>;
}

export class Pipeline{
    private context:PipelineContext;
    private animation_system:AnimationSystem ;
    constructor(context:PipelineContext){
        this.context = context;
        this.context.view = new Map();
        this.animation_system = AnimationSystem.getInstance()
    }
    public clone(input:Container,tag:string):Pipeline{
        if(input instanceof Text){
            return this.clone_text(input as Text,tag);
        }
        return this;
    }
    public add_child(stage:Container,tag:string){
        stage.addChild();
        return this;
    }
    public move_to():Pipeline{
        this.animation_system.move_to(this.context.anim_view,)
        return this;
    }
    private clone_text(input:Text,tag:string):Pipeline{
        const view = new Text();
        view.style = input.style;
        view.text = input.text;
        this.context.view.set(tag,view);
        //this.context.anim_view.
        return this;
    }
}