import * as PIXI from 'pixi.js';
import { useEffect,useRef } from 'react';

import React from 'react';

function Game() {
  const appRef = useRef(null);

  useEffect(() => {
    (async () => {
      
      const app = new PIXI.Application();
      appRef.current = app;

      await app.init({ background: "#393e46", width: 1280, height: 540})
      const imgs = ["shapes/circle.png", "shapes/rectangle.png", "shapes/triangle.png"];
      const textures = await Promise.all(imgs.map((img) => PIXI.Assets.load(img)));
      
      
      const text = new PIXI.Text({
        text:'Choose One of the below to match the shape!',
         style:  new PIXI.TextStyle({
          fontFamily: 'Arial',
          fontSize: 24,
          fill: 0xFFFFFF, // Text color: white 
          align: 'center',
        }),
      });
      text.x = 400;
      text.y = 100;
      app.stage.addChild(text);
      

      const wrong_right = new PIXI.Text( {
        text: ' ',
        
        style: new PIXI.TextStyle({
          fontFamily: 'Arial',
          fontSize: 30,
          fill: "#D2042D", // Text color: white 
          align: 'center',
        }),
      });
      wrong_right.x = 400;
      wrong_right.y = 60;
      // Add the text to the stage
      app.stage.addChild(wrong_right);

      const randomindex = Math.floor(Math.random() * textures.length);
      const random = new PIXI.Sprite(textures[randomindex]);
      random.width = 220;
      random.height = 170;
      random.x = app.screen.width / 2.5;
      random.y = app.screen.height / 4;
      app.stage.addChild(random);
      var x = 2;
      for (let index = 0; index < textures.length; index++) {
        const sprite = new PIXI.Sprite(textures[index]);
        sprite.width = 220;
        sprite.height = 170;
        sprite.x = x * (app.screen.width / 10);
        sprite.y = app.screen.height / 1.5;
        sprite.interactive = true;
        sprite.buttonMode = true;
        sprite.on('pointerdown', touched, sprite);
        app.stage.addChild(sprite);
        x += 2;
      }

      document.body.appendChild(app.canvas);
      function touched(event) {
        console.log(event.target);
        if (event.target.texture === random.texture) {
          console.log("Correct");
          // document.querySelector('.text').innerHTML = "Correct";
          wrong_right.style.fill = "#00FF00";
          
          wrong_right.text = "Correct !!";
          setTimeout(() => {
            window.location.reload();
          }, 2000);

        } else {
          console.log("Wrong");
          
          wrong_right.text = "choose the correct shape!";
          setTimeout(() => {
            wrong_right.text = "";
          }, 2000);

        }
      }


      document.getElementById('pixi-container').appendChild(app.canvas);

      
    })();
    return () => {
      if (appRef.current) {
        appRef.current.destroy();
        const canvasParent = document.getElementById('pixi-container');
        const canvas = canvasParent.querySelector('canvas');
        if (canvas) {
          canvasParent.removeChild(canvas);
        }
      }
    };
  
  }, []);
  return (
    <>
      <div>
        <h1>Match the shapes</h1>
        <div className="text">
        </div>
      </div>
      <div id="pixi-container" />
    </>);



}

export default Game;


