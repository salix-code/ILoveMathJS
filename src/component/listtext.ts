import * as PIXI from 'pixi.js';

export type  VerticalListTextDesc = {
    text : string,
    color?:string,
    fontSize ? : number
}
export type VerticalListTextInitializer = {
    items : VerticalListTextDesc[],
    defaultFontSize ? : number,
}


export class  VerticalListText  extends PIXI.Container{
    private m_initializer : VerticalListTextInitializer | null = null;
    private m_text : PIXI.Text[] =[]

    constructor(initializer : VerticalListTextInitializer){
        super();
        this.m_initializer = initializer;
        this.redraw()
    }
    redraw(){
        this.removeChildren();
        if(this.m_initializer == null){
            return;
        }
        let textIndex = 0;
        const defaultFontSize = this.m_initializer.defaultFontSize ?? 16;
        for(let item of this.m_initializer.items){
            let text : PIXI.Text | null = null;
            if(textIndex < this.m_text.length){
                text = this.m_text[textIndex]!
            }
            else{
                text = new PIXI.Text();
                this.m_text.push(text);
            }
            text.text = item.text
            
            text.x = 0;
            text.y = 30 * textIndex;
            text.style.fill = item.color??"white";
            text.style.fontSize = item.fontSize ?? defaultFontSize;
            this.addChild(text);
            textIndex += 1;
        }
        for(let i = textIndex; i < this.m_text.length;++i){
            const text = this.m_text[i]!;
            this.removeChild(text);
        }
        this.m_text.splice(textIndex,this.m_text.length - textIndex);

    }
}