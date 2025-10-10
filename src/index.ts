import { Application, Container,Text,Point } from 'pixi.js';

import { APP_QuestionTable } from './question/table';
import { AnimationSystem } from './class/anim';
import { Arrow } from './component/arrow';


const app = new Application();
await app.init();
app.renderer.resize(1200, 800);
document.body.appendChild(app.view);

let current_scene:number = 0;
let selected_table_item_index:number = -1;

type TableItem = {
    name : string,
    index : number,
    position : Point
    
}

const scene = new Container();
const table_items :TableItem[] = [];
const arrow = new Arrow(100,100,120,100,{color:0xff0000, width:2, headLength:10});
app.stage.addChild(arrow);

type TableOptions = {
    start_x? : number,
    start_y ?: number,
    fonnt_size ?: number
}

function generate_table_items(options?:TableOptions){
    options = options || {
        
    };
    options.start_x = options.start_x || 200;
    options.start_y = options.start_y || 60;
    options.fonnt_size = options.fonnt_size || 48;

    for(let i = 0; i < table_items.length; ++ i){
        const item = table_items[i]!;
        const position:Point = {x: options.start_x, y:options.start_y + i * 40} as Point;

        const text = new Text({
            text: (i + 1) + " " + item.name,
            style: {fill:'white', fontSize:options.fonnt_size}});
        text.position = position;
        item.position.x = position.x - 60;
        item.position.y = position.y + text.height / 2;
        scene.addChild(text);
    }
}

function select_table_item(index:number){
    if(index < 0 || index >= table_items.length) return;
    selected_table_item_index = index;
    const x = table_items[selected_table_item_index]!.position.x;
    const y = table_items[selected_table_item_index]!.position.y;
    arrow.setPoints(x,y,x + 20,y);
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

function show_selected_question(){
    app.stage.removeChildren();

    window.removeEventListener('keydown',on_keydown);
    const index = table_items[selected_table_item_index]!.index;
    const item = APP_QuestionTable.items[index]!;
    const question_instance = item.creator();
    app.stage.addChild(question_instance);
}


window.addEventListener('keydown', on_keydown);

current_scene = 0;
show_select_category();

const animation_system = AnimationSystem.getInstance();

app.ticker.add(() => {
    animation_system.tick(app.ticker.deltaTime / 10.0);
    
});

app.stage.addChild(scene);