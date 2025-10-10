

import type { QuestionTableItem } from '../class/table_item';
import { APP_Math_3_3 } from './ui_3_3';
import { APP_Math_3_2 } from './ui_3_2';
import { APP_Math_3_4 } from './ui_3_4';
import { APP_Math_3_6 } from './ui_3_6';
import { APP_Math_5_10 } from './math_5_10';

export interface QuestionTable{
    items: QuestionTableItem[];
}

export const APP_QuestionTable:QuestionTable = {
    items:[
        APP_Math_3_2,APP_Math_3_3,APP_Math_3_4,APP_Math_3_6,APP_Math_5_10
    ]
}