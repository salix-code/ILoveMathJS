

export class FInputStack{
    private static instance: FInputStack;
    private inputStack : KeyboardEvent[] = [];
    private inputIndex : number = 0;
    constructor(){

    }
    public static getInstance(): FInputStack {
        if (!FInputStack.instance) {
            FInputStack.instance = new FInputStack();
        }
        return FInputStack.instance;
    }
    
    public push(keyname : KeyboardEvent){
        
        this.inputStack.push(keyname);
    }

    public pop() : KeyboardEvent | null{
        if(this.inputIndex < 0 || this.inputIndex >= this.inputStack.length){
            return null
        }
        const result = this.inputStack[this.inputIndex]!
        this.inputIndex += 1;
        if(this.inputIndex >= this.inputStack.length){
            this.inputStack = [];
        }
        return result;
    }
}