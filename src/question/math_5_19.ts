import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";

class MathView extends QuestionView{
    constructor(){
        super("")
    }
}

class Question_1 extends MathView{
    constructor(){
        super();
    }
    public regenerate(): void {
        
    }
}

class Question_2 extends MathView{
    
}

class Question_3 extends MathView{
    
}


class Question_4 extends MathView{
    
}



class Controller extends QuestionController {
    constructor() {
        super();
        this.question_templates.push({
            template: Question_1,
            title: "简单差倍 - 1",
        }, {
            template: Question_2,
            title: "简单差倍 - 2",
        }, {
            template: Question_3,
            title: "简单差倍 - 3",
        }, {
            template: Question_4,
            title: "简单差倍 - 4",
        });
    }
};


export const APP_Math_5_14: QuestionTableItem = {
    category: "奥数",
    title: "差倍问题",
    creator: () => new Controller()
}