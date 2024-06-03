import React, { useEffect, useRef, useState } from "react";
import {
  Application,
  Assets,
  Sprite,
  Text,
  TextStyle,
  Graphics,
} from "pixi.js";
import data from "../cordinates.json";
// import * as PIXI from "pixi.js";
import data1 from "../level2.json";
// import wordsArray from "../connnecting_letters.json";
// import { Graphics } from '@pixi/react';
import confetti from "canvas-confetti";
// import Modal from "./Modal";
export default function Game3_1() {
  const appRef = useRef(null);
  const [stack, setStack] = useState([]);
  const [tries, setTries] = useState(0);
  const [show, setShow] = useState(1);
  const [counter, setCounter] = useState(0);
  const sId = Math.floor(Math.random() * 3);
  const iId = Math.floor(Math.random() * 3);
  const words = ["saad", "bad", "gog", "slo", "Asw"];

  const handleNext = () => {
    setTries(0);
    setCounter(0);
    setShow((show) => show + 1);
  };
  useEffect(() => {
    (async () => {
      const app = new Application();
      appRef.current = app;

      let screenSize = {};
      if (window.innerHeight < window.innerWidth) {
        screenSize = {
          width: window.innerHeight * (4 / 3),
          height: window.innerHeight * 0.8,
        };
      } else {
        screenSize = {
          width: window.innerWidth * 0.9,
          height: window.innerWidth * (3 / 4) * 0.8,
        };
      }
      await app.init({
        // background: "#000",
        resolution: window.devicePixelRatio || 1, // Use device pixel ratio for better quality
        autoDensity: true,
        antialias: true,
        canvas: document.getElementById("board"),
        ...screenSize,
      });

      app.renderer.resize(screenSize.width, screenSize.height);

      const texture = await Assets.load(`/paths2.png`);

      let scalingFactor = 1;
      if (window.innerHeight < window.innerWidth)
        scalingFactor = (app.screen.height * 0.9) / texture.frame.height;
      else scalingFactor = (app.screen.width * 0.8) / texture.frame.width;

      const sprite = new Sprite(texture);
      sprite.scale = scalingFactor;
      const Padding = {
        x: (app.screen.width - sprite.width) / 2,
        y: (app.screen.height - sprite.height) / 2,
      };
      sprite.x = Padding.x;
      sprite.y = Padding.y;
      // sprite.x = app.screen.width / 2;
      // sprite.y = app.screen.height / 2;
      // sprite.anchor.set(0.5, 0.5);
      app.stage.addChild(sprite);

      // const main_text = new Text({
      //   text: "Connect the letters to form a word",
      //   style: new TextStyle({
      //     fill: "#FFF"
      //   })
      // });
      // const wrong_right = new Text({
      //   text: " ",

      //   style: new TextStyle({
      //     fontFamily: "Arial",
      //     fontSize: 30,
      //     fill: "#D2042D", // Text color: white
      //     align: "center"
      //   })
      // });
      // main_text.x = app.screen.width / 4;
      // main_text.y = 50;
      // // main_text.anchor = 0.5;
      // app.stage.addChild(main_text);
      // wrong_right.x = app.screen.width / 4;
      // wrong_right.y = 20;
      // app.stage.addChild(wrong_right);

      for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < words[i].length; j++) {
          const letter = words[i][j];
          const T = new Text({
            text: letter,
            style: new TextStyle({
              fontFamily: "Arial",
              fontSize: 20 * scalingFactor,
              fill: "#000",
              align: "center",
            }),
          });
          const px = (data1["template4"][i + 1][j].x) * scalingFactor + Padding.x;
          const py = (data1["template4"][i + 1][j].y) * scalingFactor + Padding.y;
          const circle = new Graphics()
            .circle(px, py, 20 * scalingFactor)
            .fill("#FFF")
            .stroke({ color: "#000", width: 4 });
          circle.index = i;
          circle.display = j;
          T.x = px;
          T.y = py;
          T.anchor = 0.5;
          circle.interactive = true;
          circle.on("pointerdown", () => {
            let val = handleclick(circle);
          });
          app.stage.addChild(circle);
          app.stage.addChild(T);
        }
      }
      const handleclick = (Graphics) => {
        stack.push(Graphics);
        if (stack.length === 1) {
          if (Graphics.display !== 0) {
            Graphics.tint = "FF0000";
            stack.pop();
            resetColor(Graphics);
            return false;
          }
          Graphics.tint = "#FFFF00";
        } 
        else if (
          Graphics.display === stack[stack.length - 2].display + 1 &&
          stack[stack.length - 2].index === Graphics.index
        ) {
            if (stack.length === words[Graphics.index].length) {
                confetti({
                  particleCount: 300,
                  spread: 90,
                  decay: 0.95,
                  scalar: 1.5,
                  ticks: 150,
                  origin: {
                    y: 0.9,
                  },
                });
                while (stack.length !== 0) {
                  const elem = stack.pop();
                  elem.interactive = false;
                  elem.tint = "#00FF00";
                }
                setCounter((counter) => counter + 1);
                console.log(counter);
                return true;
              } 
            Graphics.tint = "#FFFF00";
            
        } 
        else{
                while (stack.length !== 0) {
                        const elem = stack.pop();
                        resetColor(elem);
                        elem.tint = "#FF0000";
                        elem.interactive = false;
            
                }

        }
        
      };
      const resetColor = (Graphics) => {
        setTimeout(() => {
          Graphics.tint = undefined;
          Graphics.interactive = true;
        }, 800);
      };
    })();
  }, [show]);

  return (
    <div>
      {/* <h1>Connect the letters to form a word</h1>
       */}

      <div
        id="pixi-container"
        className="d-flex flex-column"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "98vh",
        }}
      >
        <canvas id="board"></canvas>
      </div>
    </div>
  );
}
