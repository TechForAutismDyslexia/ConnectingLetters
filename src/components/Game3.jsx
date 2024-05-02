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
import data1 from "../newcor.json";
// import { Graphics } from '@pixi/react';
import confetti from "canvas-confetti";

export default function Game3() {
  const appRef = useRef(null);
  const [stack, setStack] = useState([]);
  const [counter, setCounter] = useState(0);
  const sId = Math.floor(Math.random() * 3);
  const iId = Math.floor(Math.random() * 3);
  const words = ["at", "it", "to", "me", "go"];
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
        antialias: true,
        canvas: document.getElementById("board"),
        ...screenSize,
      });

      const texture = await Assets.load("threads.jpg");

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

      for (let i = 0; i < data.left.length; i++) {
        const leftLetter = words[i][0];
        const rightLetter = words[i][1];

        const leftText = new Text({
          text: leftLetter,
          style: new TextStyle({
            fontFamily: "Arial",
            fontSize: 24 * scalingFactor,
            fill: "#000",
            align: "center",
          }),
        });

        const rightText = new Text({
          text: rightLetter,
          style: new TextStyle({
            fontFamily: "Arial",
            fontSize: 24 * scalingFactor,
            fill: "#000",
            align: "center",
          }),
        });

        // const xLeft = data.left[index].x * 2 + (1280 - 1000) / 2 - 20;
        // const yLeft = data.left[index].y * 1.5 + (720 - 338 * 1.5) / 2 + 10;
        // const xRight = data.right[index].x * 2 + (1280 - 1000) / 2 + 20;
        // const yRight = data.right[index].y * 1.5 + (720 - 338 * 1.5) / 2 - 10;

        const xLeft = (data1[i + 1].left.x - 10) * scalingFactor + Padding.x;
        const yLeft = data1[i + 1].left.y * scalingFactor + Padding.y;
        const xRight = (data1[i + 1].right.x + 10) * scalingFactor + Padding.x;
        const yRight = data1[i + 1].right.y * scalingFactor + Padding.y;

        const circleLeft = new Graphics()
          .circle(xLeft, yLeft, 15 * scalingFactor)
          .fill("#FFF")
          .stroke({ color: "#000", width: 2 });

        const circleRight = new Graphics()
          .circle(xRight, yRight, 15 * scalingFactor)
          .fill("#FFF")
          .stroke({ color: "#000", width: 2 });
        circleLeft.index = i;
        circleRight.index = i;
        circleLeft.display = 0;
        circleRight.display = 1;
        leftText.x = xLeft;
        leftText.y = yLeft;
        // leftText._anchor = 0;
        leftText.anchor = 0.5;

        rightText.x = xRight;
        rightText.y = yRight;
        rightText.anchor = 0.5;

        circleLeft.interactive = true;
        circleRight.interactive = true;

        circleLeft.on("pointerdown", () => {
          let val = handleclick(circleLeft);
          if (val) {
            circleLeft.tint = 0x33ff33;
          }
        });
        circleRight.on("pointerdown", () => {
          let val = handleclick(circleRight);
          if (val) {
            circleRight.tint = 0x33ff33;
          }
        });

        app.stage.addChild(circleLeft);
        app.stage.addChild(circleRight);
        app.stage.addChild(leftText);
        app.stage.addChild(rightText);
      }

      
      const handleclick = (Graphics) => {
        stack.push(Graphics);
        if (stack.length === 1) {
          Graphics.tint = "#FFFF00";
        } else if (stack.length === 2) {
          if (stack[1].display === stack[0].display) {
            Graphics.tint = "#FF0000";
            stack[0].tint = "#FF0000";

            color(stack[0]);
            color(stack[1]);
            stack.pop();
            stack.pop();
          } else if (Graphics.index === stack[0].index) {
            Graphics.tint = "#00FF00";
            stack[0].tint = "#00FF00";
            Graphics.interactive = false;
            stack[0].interactive = false;
            stack.pop();
            stack.pop();
            return true;
          }
        } else {
          stack.pop();
          return false;
        }
      };
      const color = (Graphics) => {
        setTimeout(() => {
          Graphics.tint = undefined;
        }, 2000);
      };
    })();
  }, []);

  return (
    <div
      id="pixi-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "98vh",
      }}
    >
      <canvas id="board"></canvas>
    </div>
  );
}
