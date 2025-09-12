import { Application, Graphics } from 'pixi.js';

const app = new Application();
await app.init();
app.renderer.resize(800, 600);
document.body.appendChild(app.view);

const graphics = new Graphics();
graphics.beginFill(0xde3249);
graphics.drawRect(50, 50, 100, 100);
graphics.endFill();
app.stage.addChild(graphics);