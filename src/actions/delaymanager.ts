
import { Ticker } from 'pixi.js';

export interface DelayTask{
    process : ((loop_counter:number)=>void) | null;
    seconds : number;
    remind : number;
    loop : number;
    loop_counter : number;
}

export class DelayPipeline {
    private m_tasks : DelayTask[] = []
    private m_index : number = -1;
    private m_state : [boolean,boolean] = [false,false];
    
    
    constructor(){

    }
    public delay(func:(loop_counter:number)=>void,seconds:number = 0,loop:number = 1){
        this.m_tasks.push({process:func,seconds:seconds,remind:seconds,loop:loop,loop_counter : 0});
        return this;
    }
    private onStart(){
        this.m_index = 0;
        this.m_state[0] = true;
    }
    private onFinish(){
        this.m_state[1] = true;
    }
    public tick(delta:number){
        if(this.isFinish()){
            return;
        }
        if(this.m_index == -1){
            this.onStart();
            if(this.m_tasks.length == 0){
                this.onFinish();
                return;
            }
        }
        let check_finish = false;
        if(this.m_index >= 0 && this.m_index < this.m_tasks.length){
            let task = this.m_tasks[this.m_index]!;
            task.remind -= delta;
            if(task.remind <= 0){
                if(task.process){
                    task.process(task.loop_counter)
                }
                task.loop -= 1;
                task.loop_counter += 1;
                if(task.loop > 0){
                    task.remind += task.seconds;
                }else{
                    this.m_index += 1;
                    check_finish = true;
                }
            }
        }
        if(check_finish){
            if(this.m_index >= this.m_tasks.length){
                this.onFinish();
            }
        }
    }

    public isFinish() : boolean {
        return this.m_state[0] && this.m_state[1];
    }
}

export class DelayManager {
    private static instance: DelayManager;
    private m_delay_pipeline :DelayPipeline[] = [];

    private m_tick : ((ticker:Ticker) => void) | null = null;

    public static getInstance(): DelayManager {
        if (!DelayManager.instance) {
            DelayManager.instance = new DelayManager();
        }
        return DelayManager.instance;
    }
    constructor(){
        
    }

    public create(){
        if(this.m_tick == null){
            this.m_tick = this.tick.bind(this)
            Ticker.shared.add(this.m_tick);
        }
        const task_pipeline = new DelayPipeline();
        this.m_delay_pipeline.push(task_pipeline);
        return task_pipeline
    }
    private tick(ticker:Ticker){
        
        for(let item of this.m_delay_pipeline){
            item.tick(ticker.deltaTime);
        }
        for(let i = this.m_delay_pipeline.length - 1; i >= 0; --i){
            const item = this.m_delay_pipeline[i]!
            if(item.isFinish()){
                this.m_delay_pipeline.splice(i,1);
            }
        }

        if(this.m_delay_pipeline.length == 0){
            if(this.m_tick){
                Ticker.shared.remove(this.m_tick);
            }
            this.m_tick = null;
        }
    }
} 