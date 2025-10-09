import { Container} from 'pixi.js';
export interface QuestionTableItem{
    category:string;
    creator: ()=>Container;
}