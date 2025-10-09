

import type { QuestionTableItem } from '../class/table_item';
import { APP_Math_3_2 } from './question/ui_3_2';

export interface QuestionTable{
    items: QuestionTableItem[];
}

export const APP_QuestionTable:QuestionTable = {
    items:[
        APP_Math_3_2
    ]
}