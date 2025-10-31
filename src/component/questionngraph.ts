import * as PIXI from 'pixi.js';

export type SegmentDesc = {
    points : [number,number][],
    type ? : number,
    color ? : string,
    dash ? : boolean,
}

export type EllipseDesc = {
    x : number,
    y : number,
    rx : number,
    ry : number,
    color?:"string"
}

export type TextDesc = {
    x : number,
    y : number,
    text : string,
    color?:string,
    fontSize? : number
}

export type CurlyBracesDesc = {
    x1 : number,
    y1 : number,
    x2 : number,
    y2 : number,
    height : number,
    text ? :string,
    color?:string,
    textColor? : string,
}

export type QuestionGraphConstructor = {
    segment : SegmentDesc[]
    ellipse? : EllipseDesc[]
    text? : TextDesc[],
    curly? : CurlyBracesDesc[],
}






function drawDash(target:PIXI.Graphics, x1 : number, y1 : number, x2 : number, y2 :number, dashLength = 5, spaceLength = 5) {
  let x = x2 - x1;
  let y = y2 - y1;
  let hyp = Math.sqrt((x) * (x) + (y) * (y));
  let units = hyp / (dashLength + spaceLength);
  let dashSpaceRatio = dashLength / (dashLength + spaceLength);
  let dashX = (x / units) * dashSpaceRatio;
  let spaceX = (x / units) - dashX;
  let dashY = (y / units) * dashSpaceRatio;
  let spaceY = (y / units) - dashY;

  target.moveTo(x1, y1);
  
  while (hyp > 0) {
    x1 += dashX;
    y1 += dashY;
    hyp -= dashLength;
    if (hyp < 0) {
      x1 = x2;
      y1 = y2;
    }
    target.lineTo(x1, y1);
    x1 += spaceX;
    y1 += spaceY;
    target.moveTo(x1, y1);
    hyp -= spaceLength;
  }
  target.moveTo(x2, y2);
  return target
}

export class QuestionGraph extends PIXI.Container{
    private initializer:QuestionGraphConstructor|null = null;
    private graph! : PIXI.Graphics;
    private m_textPool : PIXI.Text[] = [];
    private m_textIndex : number = 0;

    constructor(initializer:QuestionGraphConstructor){
        super();
        this.initializer = initializer
        this.graph = new PIXI.Graphics();
        this.addChild(this.graph);

        this.redraw()
    }

    private redraw(){
        this.graph.clear();
        
        this.m_textIndex = 0;
        
        this.draw_segment();
        this.drawCurlyBraces();
        this.draw_ellipse();
        this.draw_text();
        this.clear_text_pool();
    }
    
    private draw_segment(){
        if(this.initializer == null){
            return;
        }
        
        for(let segmentDesc of this.initializer.segment){
            if(segmentDesc.points.length <= 1){
                continue;
            }
            let prevPoint = segmentDesc.points[0]!;
            this.graph.moveTo(prevPoint[0],prevPoint[1])
            const type = segmentDesc.type??0;
            const color = segmentDesc.color??'white'
            
            for(let i = 1 ; i < segmentDesc.points.length; ++i){
                const currentPoint = [segmentDesc.points[i]![0],segmentDesc.points[i]![1]];
                if(type == 0){
                    this.graph.lineTo(currentPoint[0]!,currentPoint[1]!);
                }
                else if(type == 1){
                    drawDash(this.graph,prevPoint[0],prevPoint[1],currentPoint[0]!,currentPoint[1]!).stroke({color:color,width:1})
                }
            }
            this.graph.stroke({color:color,width:1})
            
            const dash = segmentDesc.dash??false
            if(dash){
                for(let point of segmentDesc.points){
                    this.graph.circle(point[0],point[1],4).fill("white")
                }
            }
        
        }
    }
    private draw_ellipse(){
        if(this.initializer == null){
            return;
        }
        if(this.initializer.ellipse == undefined){
            return
        }
        for(let ellipse of this.initializer.ellipse){
            const color = ellipse.color ?? "white"
            this.graph.ellipse(ellipse.x,ellipse.y,ellipse.rx,ellipse.ry)
            this.graph.stroke({color:color,width:1})
        }
    }
    private get_text_from_pool() : PIXI.Text{
        let text : PIXI.Text | null = null;
        if(this.m_textIndex >= 0 && this.m_textIndex < this.m_textPool.length){
            text = this.m_textPool[this.m_textIndex]!
        }
        else{
            text = new PIXI.Text();
            this.addChild(text);
            this.m_textPool.push(text);
        }
        this.m_textIndex += 1;
        return text!;
    }
    private clear_text_pool(){
        if (this.m_textIndex < this.m_textPool.length){
            for(let  i = this.m_textIndex; i < this.m_textPool.length; ++i){
                this.removeChild(this.m_textPool[i]!);
            }
            this.m_textPool.splice(this.m_textIndex,this.m_textPool.length - this.m_textIndex);
        }
    }
    private draw_text(){
        if(this.initializer == null){
            return;
        }
        if(this.initializer.text == undefined){
            return
        }
        
        for(let item of this.initializer.text){
            const color = item.color ?? "white"
            const fontSize = item.fontSize??16;
            
            //const 
            const text = this.get_text_from_pool();
            text.text = item.text;
            text.style.fill = color
            text.style.fontSize = fontSize
            text.text = item.text
            text.x = item.x;
            text.y = item.y;

            
            
        }
    }
    private drawCurlyBraces(){
        if(this.initializer == null){
            return;
        }
        if(this.initializer.curly == undefined){
            return
        }
        
        for(let curly of this.initializer.curly){
            
            if(curly.y1 == curly.y2){
                const halfWidth = (curly.x2 - curly.x1) / 2;
                const xOffset = Math.abs(curly.height) * 0.6;
                this.graph.moveTo(curly.x1,curly.y1)
                .lineTo(curly.x1 + xOffset,curly.y1 - curly.height)
                .lineTo(curly.x1 + halfWidth - xOffset,curly.y1 - curly.height)
                .lineTo(curly.x1 + halfWidth,curly.y1 - curly.height * 2)
                .lineTo(curly.x1 + halfWidth + xOffset ,curly.y1 - curly.height)
                .lineTo(curly.x2 - xOffset,curly.y1 - curly.height)
                .lineTo(curly.x2,curly.y2)
                .stroke({width:1,color:"yellow"});

                if(curly.text){
                    const fontSize = 16;
                    const textColor = curly.textColor ?? "white";
                    const style = new PIXI.TextStyle({ fill: textColor, fontSize: fontSize });
                    const metrics = PIXI.CanvasTextMetrics.measureText(curly.text, style);
                    
                    const text =  this.get_text_from_pool();
                    text.text = curly.text;
                    text.style = style
                    text.x = curly.x1 + halfWidth - metrics.width / 4
                    text.y = curly.y1 - curly.height * 2;
                    if(curly.height > 0) {
                        text.y -= 20;
                    }
                    else {
                        text.y += 10
                    }
                }
            }

        }
    }
}
