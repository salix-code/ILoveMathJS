import { Container} from 'pixi.js';
import type { QuestionController } from './Question';
export interface QuestionTableItem{
    category:string;
    title : string,
    creator: ()=>QuestionController;
}