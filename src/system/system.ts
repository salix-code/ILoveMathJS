
export interface IComponent{
    tag:string;
}

export interface IComponentData{
    config:IComponent;
    update_state : number;
    index : number;
}

export interface ISystem{
    update(component:IComponentData,delta : number):void;
    filter(tag:string):boolean;
};

export interface IView{
    addChild():void;
}



export class SystemManager{
    private m_data:IComponentData[] = [];
    private m_system : ISystem[] = [];
    private m_componentIndex : number = 0;
    public update(delta:number){
        for(let system of this.m_system){
            for(let data of this.m_data){
                if(data.update_state == 0){
                    continue;
                }
                if(system.filter(data.config.tag)){
                    system.update(data,delta);
                    data.update_state = 0;
                }
            }
        }
        this.m_data = this.m_data.filter(item => item.update_state >= 0);
    }
    public add_component<T extends IComponent>(component:T):number{
        let component_index = this.m_componentIndex;
        this.m_data.push({
            config:component,
            update_state : 1,
            index:component_index,
        });
        this.m_componentIndex += 1;
        return component_index;
    }
    public clear_component():void{
        for(let data of this.m_data){
            data.update_state = -1;
        }
    }
    public remove_component(component_index:number):boolean{
        for(let data of this.m_data){
            if(data.index == component_index){
                data.update_state = -1;
                return true;
            }
        }
        return false;
    }

    public update_component(component_index:number):boolean{
        for(let data of this.m_data){
            if(data.index == component_index){
                data.update_state = 1;
                return true;
            }
        }
        return false;
    }

    public add_system(system:ISystem){
        this.m_system.push(system);
    }
    
}

