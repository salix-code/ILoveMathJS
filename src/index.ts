import { Application, Graphics,Text } from 'pixi.js';

import { Math_3_3 } from './ui/ui_3_3';
import { AnimationSystem } from './component/anim';


const app = new Application();
await app.init();
app.renderer.resize(800, 600);
document.body.appendChild(app.view);


const shape_3_2 = new Math_3_3(0,0);

shape_3_2.x = 0;
shape_3_2.y = 0; 

const animation_system = AnimationSystem.getInstance();

app.ticker.add(() => {
    animation_system.tick(app.ticker.deltaTime);
    shape_3_2.tick(app.ticker.deltaTime / 10.0);
});

app.stage.addChild(shape_3_2);