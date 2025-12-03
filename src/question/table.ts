

import type { QuestionTableItem } from '../class/table_item';

import { APP_Math_3_4 } from './ui_3_4';
import { APP_Math_3_6 } from './ui_3_6';
import { APP_Math_5_10 } from './math_5_10';
import { CONFIG_MATH_1_1 } from './math_1_1';
import { APP_Math_5_13 } from './math_5_13';
import { APP_Math_5_14 } from './math_5_14';
import { APP_Math_5_18 } from './math_5_18';
import { APP_Math_5_15 } from './math_5_15';
import { APP_Math_5_16 } from './math_5_16';
import { APP_Math_6_16 } from './math_6_16';

export interface QuestionTable {
    items: QuestionTableItem[];
}

export const APP_QuestionTable: QuestionTable = {
    items: [
        APP_Math_3_4, APP_Math_3_6, APP_Math_5_10, APP_Math_5_13,APP_Math_5_14,APP_Math_5_16, APP_Math_5_18,
        APP_Math_6_16,
    ]
}