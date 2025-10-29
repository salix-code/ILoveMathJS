import * as PIXI from 'pixi.js';

export type SegmentDesc = {
    points : [number,number][],
    type ? : number,
    color ? : string,
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

export type QuestionGraphConstructor = {
    segment : SegmentDesc[]
    ellipse? : EllipseDesc[]
    text? : TextDesc[],
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
    private m_text : PIXI.Text[] = [];

    constructor(initializer:QuestionGraphConstructor){
        super();
        this.initializer = initializer
        this.graph = new PIXI.Graphics();
        this.addChild(this.graph);

        this.redraw()
    }

    private redraw(){
        this.graph.clear();
        
        
        this.draw_segment();
        this.draw_ellipse();
        this.draw_text();
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
            if(type == 0){
                for(let i = 1 ; i < segmentDesc.points.length; ++i){
                    const currentPoint = [segmentDesc.points[i]![0],segmentDesc.points[i]![1]];
                    this.graph.lineTo(currentPoint[0]!,currentPoint[1]!);
                }

                this.graph.stroke({color:color,width:1})

                for(let point of segmentDesc.points){
                    this.graph.circle(point[0],point[1],4).fill("white")
                }
                
            }
            else if (type == 1){
                for(let i = 1 ; i < segmentDesc.points.length; ++i){
                    const currentPoint = [segmentDesc.points[i]![0],segmentDesc.points[i]![1]];
                    drawDash(this.graph,prevPoint[0],prevPoint[1],currentPoint[0]!,currentPoint[1]!).stroke({color:color,width:1})
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
    private draw_text(){
        if(this.initializer == null){
            return;
        }
        if(this.initializer.text == undefined){
            return
        }
        let textIndex = 0
        for(let item of this.initializer.text){
            const color = item.color ?? "white"
            const fontSize = item.fontSize??16;
            let text : PIXI.Text | null = null;
            if(textIndex >= 0 && textIndex < this.m_text.length){
                text = this.m_text[textIndex]!
            }
            else{
                text = new PIXI.Text();
                this.m_text.push(text);
            }
            //const 
            text.style.fill = color
            text.style.fontSize = fontSize
            text.text = item.text
            text.x = item.x;
            text.y = item.y;
            this.addChild(text)
            textIndex += 1;
        }

        if (textIndex < this.m_text.length){
            for(let  i = textIndex; i < this.m_text.length; ++i){
                this.removeChild(this.m_text[i]!);
            }
            this.m_text.splice(textIndex,this.m_text.length - textIndex);
        }
    }
    private drawCurlyBraces(){
        
    }
}



class QuestionView {
    // 添加绘制大括号的方法
    public make_brace(isLeft: boolean, x: number, y: number, height: number) {
        const brace = new Graphics();
        brace.lineStyle(3, 0x000000);

        if (isLeft) {
            brace.moveTo(x, y);
            brace.bezierCurveTo(x - 20, y, x - 20, y + height / 2, x, y + height);
        } else {
            brace.moveTo(x, y);
            brace.bezierCurveTo(x + 20, y, x + 20, y + height / 2, x, y + height);
        }

        this.addChild(brace);
        return brace;
    }
}