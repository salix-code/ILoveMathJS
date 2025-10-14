import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";

class Question_1 extends QuestionView {
    constructor(title:string) {
        super(title);
        this.regenerate();
    }

    public regenerate(){
        
    }
}

export class Math_1_1 extends QuestionController {
    constructor(x : number,y:number) {
        super();

        this.question_templates.push({
            template:Question_1,
            title:"大数的读法"
        })
    }
}

export const CONFIG_MATH_1_1 : QuestionTableItem = {
    category: "数学",
    title: "大数的读法",
    creator: ()=> new Math_1_1(0,0)
}