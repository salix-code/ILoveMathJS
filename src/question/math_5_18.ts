import * as PIXI from 'pixi.js';
import { QuestionController, QuestionView } from "../class/Question";
import type { QuestionTableItem } from "../class/table_item";
import { RectDefinition, RectRender, SegmentRender, TextRender, type SegmentRenderItem, type TextRenderItem } from '../actions/rendersystem';
//import { RenderSystem } from '../actions/rendersystem';

function string_format(str: string, ...args: any[]) {
    return str.replace(/{(\d+)}/g, (match, index) => String(args[index]));
}

class MathView extends QuestionView {
    protected m_textPanel: PIXI.Container | null = null;
    protected m_graphics: PIXI.Graphics | null = null;
    //protected m_render : RenderSystem | null = null;
    constructor() {
        super("")

        this.m_textPanel = new PIXI.Container();
        this.m_textPanel.x = 100;
        this.m_textPanel.y = 160;
        this.m_textPanel.label = "dontclean"
        this.addChild(this.m_textPanel);

        this.m_graphics = new PIXI.Graphics();
        this.m_graphics.x = 100;
        this.m_graphics.y = 160;
        this.m_graphics.label = "dontclean"
        this.addChild(this.m_graphics);
    }
    public clean(): void {
        super.clean();
        if (this.m_graphics) {
            this.m_graphics.clear();
        }
        if (this.m_textPanel) {
            this.m_textPanel.removeChildren();
        }
    }

    public redraw() {

    }
    public requestUpdate(tag: string) {

    }
}

class RectDefinitionFactory {
    private m_rectData: RectDefinition;
    constructor() {
        this.m_rectData = new RectDefinition();
    }
    public Add(x: number, y: number, color?: string) {
        this.m_rectData.Add({
            x: x,
            y: y,
            w: 30,
            h: 30
        })
    }
    public Append(x: number, y: number, n: number, span?: [number, number]) {
        span = span ?? [0, 0];
        for (let i = 0; i < n; ++i) {
            this.m_rectData.Add({
                x: x + i * (30 + span[0]),
                y: y,
                w: 30,
                h: 30
            });
        }
    }
    public Data() {
        return this.m_rectData;
    }
    public Empty() {
        this.m_rectData.Empty();
    }
}

class MathViewWithData extends MathView {
    private m_textRender: TextRender | null = null;
    private m_segmentRender: SegmentRender | null = null;
    private m_rectReder: RectRender | null = null;
    protected m_textItem: TextRenderItem[] = [];
    protected m_segmentItem: SegmentRenderItem | null = null;
    //private m_rectData: RectDefinition | null = null;
    protected m_rectData: RectDefinitionFactory = new RectDefinitionFactory();
    constructor() {
        super();

        if (this.m_textPanel) {
            this.m_textRender = new TextRender(this.m_textPanel, this.m_textItem)
        }
        this.m_segmentItem = { lines: [], dashs: [] };
        if (this.m_graphics && this.m_segmentItem) {
            this.m_segmentRender = new SegmentRender(this.m_graphics, this.m_segmentItem)
        }
        if (this.m_graphics) {
            //this.m_rectData = new RectDefinition();
            this.m_rectReder = new RectRender(this.m_rectData.Data(), this.m_graphics);
        }
    }
    public onShow(str: string) {
        this.m_textItem.splice(0, this.m_textItem.length);
        this.m_rectData.Empty();
        const arr = str.trim().split(" ");
        let maxLen = -1;
        for (let i of arr) {
            maxLen = Math.max(maxLen, i.trim().length);
        }
        let offsetY = 60;

        const style = new PIXI.TextStyle({ fill: 'white', fontSize: "26" });
        
        const beginX = 300;
        const rowHeight = 50;
        const colWidth = 60;
        for (let i of arr) {
            if (i.length == 0) {
                continue;
            }
            if (i.trim().length == 0) {
                continue;
            }
            let offsetX = beginX;
            if (i.length < maxLen) {
                offsetX += (maxLen - i.length) * colWidth;
            }

            for (let c of i) {
                if (c == '?') {
                    this.m_rectData.Add(offsetX, offsetY)
                    offsetX += colWidth;
                }
                else if (c == '+' || c == '-') {

                    this.m_textItem.push({
                        text: c,
                        x: beginX - 40,
                        y: offsetY,
                    });
                    offsetY -= rowHeight;
                    break;

                } else if (c == '=') {
                    this.m_segmentItem?.lines.push({
                        x1: beginX - 40, y1: offsetY - 15, x2: beginX + maxLen * colWidth, y2: offsetY - 15, color: 'white'
                    });
                    offsetY -= rowHeight;
                    break;
                    
                } else {

                    const metrics = PIXI.CanvasTextMetrics.measureText(c, style);

                    this.m_textItem.push({
                        text: c,
                        x: offsetX + (30 - metrics.width) / 2,
                        y: offsetY,
                    });
                    offsetX += 60;
                }
            }

            offsetY += rowHeight;
        }


        

        this.m_textRender?.redraw();
        this.m_rectReder?.redraw();
        this.m_segmentRender?.redraw();
    }

}


class Question_1 extends MathView {
    private m_textRender: TextRender | null = null;
    private m_segmentRender: SegmentRender | null = null
    private m_textItem: TextRenderItem[] = [];
    private m_segmentItem: SegmentRenderItem | null = null;
    constructor() {
        super();

        if (this.m_textPanel) {
            this.m_textRender = new TextRender(this.m_textPanel, this.m_textItem)
        }
        this.m_segmentItem = { lines: [], dashs: [] };
        if (this.m_graphics && this.m_segmentItem) {
            this.m_segmentRender = new SegmentRender(this.m_graphics, this.m_segmentItem)
        }
        this.regenerate();
    }
    public regenerate(): void {
        if (this.m_textRender == null) {
            return;
        }
        const a = "蛇年"
        let pos = 300;
        for (let x of a) {
            this.m_textItem.push({
                text: x,
                x: pos,
                y: 50,
            });
            pos += 60;
        }

        this.m_textItem.push({
            text: '+',
            x: 120,
            y: 120,
        });



        const b = "万事如意"
        pos = 180
        for (let x of b) {
            this.m_textItem.push({
                text: x,
                x: pos,
                y: 120,
            });
            pos += 60
        }

        const c = "2025"
        pos = 182
        for (let x of c) {
            this.m_textItem.push({
                text: x,
                x: pos,
                y: 200,
            })
            pos += 60
        }

        if (this.m_segmentItem && this.m_segmentRender) {
            this.m_segmentItem?.lines.push({
                x1: 120, y1: 180, x2: 520, y2: 180, color: 'white'
            });
            this.m_segmentRender.redraw()

        }


        this.m_textRender.redraw();

    }
}



class Question_2 extends MathViewWithData {
    private m_number: { a: number, b: number, c: number } = { a: 0, b: 0, c: 0 };

    constructor() {
        super();


        this.regenerate();
    }

    public regenerate(): void {
        this.clean();

        this.m_number.c = Math.floor(Math.random() * 700 + 300);
        this.m_number.b = Math.floor(Math.random() * (this.m_number.c - 200) + 100);
        this.m_number.a = this.m_number.c - this.m_number.b;


        this.onShow("???" + " + " + this.m_number.b + " = " + this.m_number.c)

    }

}

class Question_3 extends MathViewWithData {
    private m_number: { a: number, b: number, c: number } = { a: 0, b: 0, c: 0 };
    
    constructor() {
        super();
        this.regenerate();
    }

    public regenerate(): void {
        this.clean();

        this.m_number.c = Math.floor(Math.random() * 700 + 300);
        this.m_number.b = Math.floor(Math.random() * (this.m_number.c - 200) + 100);
        this.m_number.a = this.m_number.c - this.m_number.b;
        // a + b = c
        const a = string_format("?{0}?",Math.floor(this.m_number.a / 10) % 10);
        const b = string_format("{0}?{1}",Math.floor(this.m_number.b / 100),this.m_number.b % 10);
        this.onShow(string_format("{0} + {1} = {2}",a,b,this.m_number.c));

    }
    private generateText(num: number, x: number, y: number) {
        const str = num + "";
        let o = 0
        for (let s of str) {
            this.m_textItem.push({
                text: s,
                x: x + o,
                y: y,
            });
            o += 55;
        }
    }
}


class Question_4 extends MathView {

}



class Controller extends QuestionController {
    constructor() {
        super();
        this.question_templates.push({
            template: Question_1,
            title: "数字谜 - 1",
        }, {
            template: Question_2,
            title: "数字谜 - 2",
        }, {
            template: Question_3,
            title: "数字谜 - 3",
        }, {
            template: Question_4,
            title: "数字谜 - 4",
        });
    }
};


export const APP_Math_5_18: QuestionTableItem = {
    category: "奥数",
    title: "加减法数字谜",
    creator: () => new Controller()
}