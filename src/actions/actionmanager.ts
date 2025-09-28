
export interface ActionConfig{
    tag:string;
}

export interface ActionResult{

}

export interface ActionRunner{
    run(config:ActionConfig):ActionResult;
}

export class ActionManager{
    private static instance: ActionManager;
    private m_action_runners: Map<string,ActionRunner> = new Map();
    constructor(){

    }
    public static getInstance(): ActionManager {
        if (!ActionManager.instance) {
            ActionManager.instance = new ActionManager();
        }
        return ActionManager.instance;
    }

    public run(config:ActionConfig):ActionResult{
        if(this.m_action_runners.has(config.tag)){
            let runner = this.m_action_runners.get(config.tag)!;
            return runner.run(config);
        }

        return {} as ActionResult;
    }
}