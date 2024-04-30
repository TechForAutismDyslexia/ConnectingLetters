import React, { useEffect, useRef, useState } from "react";
import { Application, Assets, Sprite, Text, TextStyle, Graphics } from "pixi.js";
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
          height: window.innerHeight * 0.8
        };
      } else {
        screenSize = {
          width: window.innerWidth * 0.9,
          height: window.innerWidth * (3 / 4)
        };
      }
      await app.init({
        // background: "#000",
        antialias: true,
        canvas: document.getElementById("board"),
        ...screenSize
      });

      const texture = await Assets.load("threads.jpg");

      const sprite = new Sprite(texture);
      const scalingFactor = (app.screen.height * 0.9) / texture.frame.height;
      sprite.scale = scalingFactor;
      const Padding = {
        x: (app.screen.width - sprite.width) / 2,
        y: (app.screen.height - sprite.height) / 2
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
            align: "center"
          })
        });

        const rightText = new Text({
          text: rightLetter,
          style: new TextStyle({
            fontFamily: "Arial",
            fontSize: 24 * scalingFactor,
            fill: "#000",
            align: "center"
          })
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
          let val = handleClick(leftLetter, i, leftText, circleLeft);
          if (val) {
            circleLeft.tint = 0x33ff33;
          } else if (stack.length === 0) {
            circleLeft.tint = undefined;
          }
        });
        circleRight.on("pointerdown", () => {
          let val = handleClick(rightLetter, i, rightText, circleRight);
          if (val) {
            circleRight.tint = 0x33ff33;
          } else if (stack.length === 0) {
            circleRight.tint = undefined;
          }
        });

        app.stage.addChild(circleLeft);
        app.stage.addChild(circleRight);
        app.stage.addChild(leftText);
        app.stage.addChild(rightText);
      }

      const handleClick = (letter, index, Text, Graphics) => {
        console.log("Clicked " + letter + " at index " + index);
        if (Text.text === "") {
          return true;
        }

        // Check if the stack is empty or the index of the new letter is equal to the index of the top element
        if (
          stack.length === 0 ||
          (index === stack[stack.length - 1].index && letter !== stack[0].letter)
        ) {
          // Push the new letter and its index to the stack
          stack.push({ letter, index, Text, Graphics });
          if (stack.length === 2) {
            // confetti({
            //     particleCount: 600,
            //     spread: 90,
            //     decay: 0.95,
            //     scalar: 1.5,
            //     ticks: 150,
            //     origin: { y: 0.9 },
            // });

            console.log("correct");
            setCounter(counter + 1);
            // wrong_right.style.fill = "#00FF00";
            // wrong_right.text = "correct!!";
            // setTimeout(() => {
            //   wrong_right.text = "";
            // }, 2000);
            // console.log(stack);
            stack.pop();
            stack.pop();

            // stack[-1].text = "";
          }
          return true;
        } else {
          console.log("Incorrect order!");
          // Clear the stack if the order is incorrect
          console.log(stack);
          // wrong_right.style.fill = "#D2042D";
          // wrong_right.text = "Incorrect order!";
          Graphics.tint = "#FF0000";
          stack[0].Graphics.tint = "#FF0000";
          // setTimeout(() => {
          //   Graphics.tint = undefined;
          //   stack[0].Graphics.tint = undefined;
          //   //   wrong_right.text = "";
          // }, 2000);
          // stack.pop();
          return false;
        }
      };
    })();
  }, []);

  return (
    <div
      id="pixi-container"
      style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "98vh" }}
    >
      <canvas id="board"></canvas>
    </div>
  );
}
