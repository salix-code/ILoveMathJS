import { Application, Container,Text,Point } from 'pixi.js';

import { APP_QuestionTable } from './question/table';
import { AnimationSystem } from './class/anim';
import { Arrow, type ArrowInitializer } from './component/arrow';
import { Vector4 } from './maths/vector';
import { FInputStack } from './class/inputstack';
import type { QuestionController } from './class/Question';


const app = new Application();
await app.init();
app.renderer.resize(1200, 600);
document.body.appendChild(app.view);

let current_scene:number = 0;
let selected_table_item_index:number = -1;
let current_question_instance: QuestionController|null = null;

type TableItem = {
    name : string,
    index : number,
    position : Point
    
}

const scene = new Container();
const table_items :TableItem[] = [];

const arrow_initializer : ArrowInitializer = {
    start_point : {
        point: new Vector4(100,100,0,0),
        size : {width : 0,height : 0}
    },
    end_point : {
        point: new Vector4(120,10,0,0),
        size : {width : 0,height : 0}
    },
    option : {

    }
}
const arrow = new Arrow(arrow_initializer);
app.stage.addChild(arrow);

type TableOptions = {
    start_x? : number,
    start_y ?: number,
    fonnt_size ?: number,
    height_span ? :number

}

function generate_table_items(options?:TableOptions){
    options = options || {
        
    };
    options.start_x = options.start_x || 200;
    options.start_y = options.start_y || 60;
    options.fonnt_size = options.fonnt_size || 48;
    options.height_span = options.height_span || 20;

    let height_offset = 0
    for(let i = 0; i < table_items.length; ++ i){
        const item = table_items[i]!;
        const position:Point = {x: options.start_x, y:options.start_y + height_offset} as Point;

        const text = new Text({
            text: (i + 1) + " " + item.name,
            style: {fill:'white', fontSize:options.fonnt_size}});
        text.position = position;
        item.position.x = position.x - 60;
        item.position.y = position.y + text.height / 2;
        height_offset += text.height + options.height_span;
        scene.addChild(text);
    }
}

function select_table_item(index:number){
    if(index < 0 || index >= table_items.length) return;
    selected_table_item_index = index;
    const x = table_items[selected_table_item_index]!.position.x;
    const y = table_items[selected_table_item_index]!.position.y;
   // arrow.setPoints(x,y,x + 20,y);
   arrow_initializer.start_point.point.x = x;
   arrow_initializer.start_point.point.y = y;
   arrow_initializer.end_point.point.x = x + 20;
   arrow_initializer.end_point.point.y = y;

   arrow.redraw();
}

function show_select_category(){
    table_items.slice(0, table_items.length);
    const unique_categories = new Set<string>();
    for(let i = 0; i < APP_QuestionTable.items.length; ++i){
        const item = APP_QuestionTable.items[i]!;
        if(unique_categories.has(item.category) == false){
            unique_categories.add(item.category);
            table_items.push({name:item.category, index:i, position:{x:0,y:0} as Point} );
        }
    }
    generate_table_items();
    select_table_item(0);
}


function show_select_question(){
    let category = table_items[selected_table_item_index]!.name;
    table_items.splice(0, table_items.length);
    
    for(let i = 0; i < APP_QuestionTable.items.length; ++i){
        const item = APP_QuestionTable.items[i]!;
        if(item && item.category == category){
            table_items.push({name:item.title, index:i, position: {x:0,y:0} as Point} );
        }
    }

    generate_table_items({start_y:20,fonnt_size:24});
    select_table_item(0);
}


function on_keydown(e:KeyboardEvent){
    if(current_scene < 2){
        if(e.key == 'ArrowDown'){
            if(selected_table_item_index + 1 < table_items.length){
                select_table_item(selected_table_item_index + 1);
            }
        }
        else if(e.key == 'ArrowUp'){
            if(selected_table_item_index - 1 >= 0){
                select_table_item(selected_table_item_index - 1);
            }
        }
        else if(e.key == 'Enter'){
            if(current_scene == 0){
                current_scene = 1;
                scene.removeChildren();
                show_select_question();
            }
            else if(current_scene == 1){
                current_scene = 2;
                scene.removeChildren();
                show_selected_question()
            }
        }
    }
    else{
        FInputStack.getInstance().push(e)
    }
    
}

function show_selected_question(){
    app.stage.removeChildren();

    //window.removeEventListener('keydown',on_keydown);
    const index = table_items[selected_table_item_index]!.index;
    const item = APP_QuestionTable.items[index]!;
    current_question_instance = item.creator();
    app.stage.addChild(current_question_instance);
    current_question_instance.start();
}


window.addEventListener('keydown', on_keydown);

current_scene = 0;
show_select_category();

const animation_system = AnimationSystem.getInstance();

app.ticker.add(() => {
    //animation_system.tick(app.ticker.deltaTime / 10.0);
    const e = FInputStack.getInstance().pop();
    if(e != null){
        if(current_question_instance){
            current_question_instance.onKeyDown(e)
        }
    }
    if(current_question_instance){
        current_question_instance.redraw();
    }
    
    
});

app.stage.addChild(scene);