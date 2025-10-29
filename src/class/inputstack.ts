

export class FInputStack{
    private static instance: FInputStack;
    private inputStack : string[] = [];
    private inputIndex : number = 0;
    constructor(){

    }
    public static getInstance(): FInputStack {
        if (!FInputStack.instance) {
            FInputStack.instance = new FInputStack();
        }
        return FInputStack.instance;
    }
    
    public push(keyname : string){
        
        this.inputStack.push(keyname);
    }

    public pop() : string{
        if(this.inputIndex < 0 || this.inputIndex >= this.inputStack.length){
            return ""
        }
        const result = this.inputStack[this.inputIndex]!
        this.inputIndex += 1;
        if(this.inputIndex >= this.inputStack.length){
            this.inputStack = [];
        }
        return result;
    }
}