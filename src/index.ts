import { Application, Graphics,Text } from 'pixi.js';

import { Math_3_3 } from './ui/ui_3_3';


const app = new Application();
await app.init();
app.renderer.resize(800, 600);
document.body.appendChild(app.view);


const title = new Text('Hello, PixiJS!', { fontSize: 36, fill: 'white' });

title.x = 200
title.y = 0


const shape_3_2 = new Math_3_3(0,0);

shape_3_2.x = 0;
shape_3_2.y = 200;  

app.stage.addChild(title);
app.stage.addChild(shape_3_2);