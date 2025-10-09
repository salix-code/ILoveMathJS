import { Application, Graphics,Text } from 'pixi.js';

import { APP_QuestionTable } from './question/table';
import { AnimationSystem } from './class/anim';
import { Arrow } from './component/arrow';


const app = new Application();
await app.init();
app.renderer.resize(800, 600);
document.body.appendChild(app.view);

let current_scene:number = 0;
let selected_question:number = -1;

const unique_categories = new Set<string>();

const arrow = new Arrow(100,100,200,200,{color:0xff0000, width:2, headLength:20});
const scene = new Container();
scene.addChild(arrow);

for(let i = 0; i < APP_QuestionTable.items.length; ++i){
    const item = APP_QuestionTable.items[i]!;
    if(unique_categories.has(item.category) == false){
        unique_categories.add(item.category);
        const text = new Text(item.category,{style:{fill:'white', fontSize:32}});
        text.point = {x:20, y:20 + i * 40};
        scene.addChild(text);
    }
}

function show_select_question(){

}

function show_selected_question(){
    const item = APP_QuestionTable.items[selected_question]!;
    const question_instance = item.creator();
    scene.addChild(question_instance);
}

window.addEventListener('keydown', (e) => {
    if(e.key == 'ArrowDown'){
        arrow.x = 0;
        arrow.y = 0;
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
});



const animation_system = AnimationSystem.getInstance();

app.ticker.add(() => {
    animation_system.tick(app.ticker.deltaTime / 10.0);
    
});

app.stage.addChild(scene);