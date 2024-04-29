
import * as PIXI from 'pixi.js';
import confetti from 'canvas-confetti';
import {useEffect} from 'react';


// import { Application, Assets, Sprite, SCALE_MODES } from 'pixi.js';
function Game(){
    useEffect(()=>{
        (async () => {
            const app = new PIXI.Application();
    
            await app.init({ background: "#1099bb", resizeTo: window });
    
            document.body.appendChild(app.canvas);
    
            const imgs = ["animal/elephant.png", "animal/giraffe.png", "animal/rhino.png", "animal/zebra.png"];
    
            const textures = await Promise.all(imgs.map((img) => PIXI.Assets.load(img)));
    
            textures.forEach((texture) => (texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST));
    
            for (let i = 0; i < 8; i++) {
              let x;
              switch (i % 4) {
                case 0:
                  x = app.screen.width * 0.75;
                  break;
                case 1:
                  x = app.screen.width * 0.15;
                  break;
                case 2:
                  x = app.screen.width * 0.85;
                  break;
                case 3:
                  x = app.screen.width * 0.25;
                  break;
                default:
                  break;
              }
              createObj(x, ((app.screen.height /4) * (i % 2 ? i : i + 1)) / 2, i);
            }
    
            function createObj(x, y, id) {
              const bunny = new PIXI.Sprite(textures[Math.floor(id / 2)]);
    
              let line;
              if (id % 2 === 0) {
                bunny.tint = 0x222222;
              }
    
              bunny.eventMode = "static";
    
              bunny.anchor.set(0.5);
              if (id % 2 !== 0) {
                bunny.cursor = "pointer";
                bunny.on("pointerdown", onDragStart, bunny);
              }
    
              bunny.scale.set(id % 2 ? 0.12 : 0.125);
    
              bunny.x = x - bunny.width / 8;
              bunny.y = y;
              bunny.id = id;
              app.stage.addChild(bunny);
            }
    
            let dragTarget = null;
    
            app.stage.eventMode = "static";
            app.stage.hitArea = app.screen;
            app.stage.on("pointerup", onDragEnd);
            app.stage.on("pointerupoutside", onDragEnd);
    
            function onDragMove(event) {
              if (dragTarget) {
                if (dragTarget.id % 2) {
                  let shadow = app.stage.children[dragTarget.id - 1];
                  if (
                    shadow.position.x < dragTarget.position.x &&
                    dragTarget.position.x + dragTarget.width < shadow.position.x + shadow.width &&
                    shadow.position.y < dragTarget.position.y &&
                    dragTarget.position.y + dragTarget.height < shadow.position.y + shadow.height
                  ) {
                    dragTarget.tint = 0x88ff88;
                    dragTarget = null;
                    confetti({
                      particleCount: 600,
                      spread: 100,
                      decay: 0.95,
                      scalar: 1.5,
                      ticks: 150,
                      origin: { y: 0.9 }
                    });
                  } else {
                    // dragTarget.tint = null;
                    dragTarget.parent.toLocal(event.global, null, dragTarget.position);
                  }
                }
              }
            }
            function onDragStart() {
              this.alpha = 0.5;
              dragTarget = this;
              app.stage.on("pointermove", onDragMove);
            }
    
            function onDragEnd() {
              if (dragTarget) {
                app.stage.off("pointermove", onDragMove);
                dragTarget.alpha = 1;
                dragTarget = null;
              }
            }
          })();

     
    })
      

    // return null;
  



}
export default Game;