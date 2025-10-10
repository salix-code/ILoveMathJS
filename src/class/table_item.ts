import { Container} from 'pixi.js';
export interface QuestionTableItem{
    category:string;
    title : string,
    creator: ()=>Container;
}