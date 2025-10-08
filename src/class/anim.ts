import type { Container } from 'pixi.js';

type Position = {
    x : number,
    y : number
}
export type AnimationItem = {
    view : Container;
    target : Position,
    seconds : number;
    cb : (()=>void) | undefined;
}
export type AnimationData = {
    speed_x : number,
    speed_y : number,
    duration:number,
}

export class AnimationSystem {
    private static instance: AnimationSystem;

    protected items: AnimationItem[] = [];
    protected datas: AnimationData[] = [];

    constructor(){

    }
    public static getInstance(): AnimationSystem {
        if (!AnimationSystem.instance) {
            AnimationSystem.instance = new AnimationSystem();
        }
        return AnimationSystem.instance;
    }

    public is_playing_anim() : boolean {
        return this.items.length > 0;
    }

    public tick(deltaTime:number):void{
        let do_animationn = false;
        //let need_delete_item:number[] = []
        
        for(let i = 0; i < this.items.length;++i){
            const item = this.items[i]!;
            const data = this.datas[i]!;
            if(data.duration >= 0){
                do_animationn = true;
                data.duration -= deltaTime;
                item.view.x += data.speed_x * deltaTime;
                item.view.y += data.speed_y * deltaTime;

                if(data.duration <= 0){
                    item.view.x = item.target.x;
                    item.view.y = item.target.y;

                    if(item.cb){
                        item.cb();
                    }
                    data.duration = -1;
                }
            }
        }
        if (do_animationn == false){
            this.items = [];
            this.datas = [];
        }

    }

    public move_to(view:Container,x:number,y:number,seconds:number,cb? : ()=>void):void{
        const item : AnimationItem = {
            view :view,
            target : {
                x : x,
                y : y
            },
            seconds:seconds,
            cb : cb,
        }
        
        let data:AnimationData = {
            speed_x : (x  - view.x) / seconds, 
            speed_y : (y  - view.y) / seconds, 
            duration : seconds,
        }
        this.items.push(item);
        this.datas.push(data);
    }
};