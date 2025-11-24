

export type FinishDelegate = () => void;
export type TaskTickDelegate = (arg0: number[]) => void;

type FTask = {
    run: TaskTickDelegate,
    id: number,
    leftTime: number,
    stop: number[],
    current: number[],
    speed: number[],
    first: boolean
}


export class FTaskHandle {
    private index: number;
    private m_finish: FinishDelegate | null = null;
    constructor(index: number) {
        this.index = index;
    }
    public Finish(lambda: FinishDelegate) {
        this.m_finish = lambda;
        return this;
    }
    public onFinish() {
        if (this.m_finish) {
            this.m_finish();
        }
    }
}

export class FTaskManager {
    private m_task: Map<number, FTask> = new Map();
    private m_taskCounter: number = 1;
    private m_taskHandle: Map<number, FTaskHandle> = new Map();
    private static instance: FTaskManager;
    public static getInstance(): FTaskManager {
        if (!FTaskManager.instance) {
            FTaskManager.instance = new FTaskManager();
        }
        return FTaskManager.instance;
    }

    private calc_speed(start: number[], stop: number[], seconds: number): number[] {
        const r: number[] = [];
        for (let i = 0; i < start.length && i < stop.length; ++i) {
            r.push((stop[i]! - start[i]!) / (seconds * 1000))
        }
        return r;
    }

    private step_speed(current: number[], speed: number[], elapsedMS: number): number[] {
        let delta:number[] = []
        for (let i = 0; i < current.length && i < speed.length; ++i) {
            delta.push(speed[i]! * elapsedMS);
            current[i] = current[i]! + delta[i]!;
        }

        return current
    }

    public Lerp1(start: number, stop: number, seconds: number, lambda: (n: number) => void): FTaskHandle {

        const taskCounter = this.m_taskCounter;

        const task :FTask = {
            run: (n: number[]) => { lambda(n[0]!); },
            id: taskCounter,
            leftTime: seconds * 1000,
            stop: [stop],
            current: [start],
            speed: this.calc_speed([start], [stop], seconds),
            first: true
        }

        this.m_task.set(task.id, task);
        const taskHandle = new FTaskHandle(taskCounter);
        this.m_taskHandle.set(task.id, taskHandle);
        this.m_taskCounter += 1;
        return taskHandle;
    }
    public Lerp2(start: number[], stop: number[], seconds: number, lambda: (n: number[]) => void): FTaskHandle {

        const taskCounter = this.m_taskCounter;

        const task :FTask = {
            run: (n: number[]) => { lambda(n); },
            id: taskCounter,
            leftTime: seconds * 1000,
            stop: stop,
            current: start,
            speed: this.calc_speed(start, stop, seconds),
            first: true
        }
        this.m_task.set(task.id, task);
        const taskHandle = new FTaskHandle(taskCounter);
        this.m_taskHandle.set(task.id, taskHandle);
        this.m_taskCounter += 1;
        return taskHandle;

    }


    public Tick(elapsedMS: number): void {
        const needRemoveTask: Set<number> = new Set();
        for (let [id, task] of this.m_task) {
            if (task.first) {
                task.run(task.current);
                task.first = false;
            } else if (task.leftTime > 0) {
                task.leftTime -= elapsedMS;
                if (task.leftTime <= 0) {
                    task.leftTime = 0;
                    task.run(task.stop);
                } else {
                    //let delta = task.current;
                    task.current = this.step_speed(task.current, task.speed, elapsedMS);
                   
                    task.run(task.current);

                }
            } else if (this.m_taskHandle.has(task.id)) {
                const handle = this.m_taskHandle.get(task.id);
                if (handle) {
                    handle.onFinish();
                    this.m_taskHandle.delete(task.id);
                    needRemoveTask.add(task.id)
                }
            }
        }

        for (let id of needRemoveTask) {
            if (this.m_task.has(id)) {
                this.m_task.delete(id);
            }
        }

    }
}