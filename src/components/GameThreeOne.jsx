import React, { useEffect, useRef, useState } from "react";
import {
  Application,
  Assets,
  Sprite,
  Text,
  TextStyle,
  Graphics,
} from "pixi.js";
// import * as PIXI from "pixi.js";
import data1 from "../level1.json";
import { Popover } from "bootstrap";
import { Link } from "react-router-dom";
// import wordsArray from "../connnecting_letters.json";
import confetti from "canvas-confetti";
export default function GameThreeOne() {
  const appRef = useRef(null);
  const startTimeRef = useRef(null);
  const stack = []; 
  const [tries, setTries] = useState(0);
  const [show, setShow] = useState(1);
  const [counter, setCounter] = useState(0);
  const WordArray = [
    ["hop","bus","nut","pen","tap"],
    ["men","ant","mix","yet","cup"],
    ["net","ink","hit","bet","old"]
  ]
  const words = WordArray[show-1];
  const handleNext = () => {
    setTries(0);
    setCounter(0);
    setShow((show) => show + 1);
  };
  const instruction = new Audio("/instructions.wav");
  const getVoice = (lang = "en-US") => {
    const voices = window.speechSynthesis.getVoices();
    return voices.find(voice => voice.lang === lang) || voices[0];
  };

  useEffect(() => {
    if (!startTimeRef.current) {
      startTimeRef.current = new Date(); // Set start time only once
    }
    const voice = (letter, rate=0.8 , pitch = 1) => {
      var msg = new SpeechSynthesisUtterance(letter);
      msg.voice = getVoice();
      msg.rate = rate;
      msg.pitch = pitch;
      window.speechSynthesis.speak(msg);
    };

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
        background: "#000",
        resolution: window.devicePixelRatio || 1, // Use device pixel ratio for better quality
        autoDensity: true,
        antialias: true,
        canvas: document.getElementById("board"),
        ...screenSize,
      });

      app.renderer.resize(screenSize.width, screenSize.height);

      const texture = await Assets.load(`/level1/template${show}.jpeg`);

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
      app.stage.addChild(sprite);

      for (let i = 0; i < words.length; i++) {
        for (let j = 0; j < words[i].length; j++) {
          const letter = words[i][j];
          const T = new Text({
            text: letter,
            style: new TextStyle({
              fontFamily: "Arial",
              fontSize: 50 * scalingFactor,
              fill: "#000",
              align: "center",
            }),
          });
          const px = (data1[`template${show}`][i + 1][j].x) * scalingFactor + Padding.x;
          const py = (data1[`template${show}`][i + 1][j].y) * scalingFactor + Padding.y;
          const circle = new Graphics()
            .circle(px, py, 60 * scalingFactor)
            .fill("#FFF")
            .stroke({ color: "#000", width: 2 });
          circle.index = i;
          circle.display = j;
          T.x = px;
          T.y = py;
          T.anchor = 0.5;
          circle.interactive = true;
          circle.on("pointerdown", () => {
             handleclick(circle);
          });
          app.stage.addChild(circle);
          app.stage.addChild(T);
        }
      }
      const handleclick = (Graphics) => {
        stack.push(Graphics);
        const letter = words[Graphics.index][Graphics.display];
        voice(letter, letter.length);
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
              voice(words[Graphics.index]);
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
            setTries(tries=>tries+1)
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
  useEffect(() => {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new Popover(popoverTriggerEl);
    });
    return () => {
      popoverList.forEach(popover => popover.dispose());
    };
  }, [])

  return (
    <div>
      <div
        id="pixi-container"
        className="d-flex flex-column"
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "98vh",
        }}
      >
        
        {!(counter===5 && show===3) ? (<>
          <div className="d-flex justify-content-around w-100">
          <b className="fs-4" style={{ color: "green" }}>Correct {counter}</b>
          <b className="fs-4">Stage {show}</b>
        </div>
        <div className="d-flex justify-content-around w-100">
          <div className="d-flex justify-content-start">
          <b className="fs-4" style={{ color: "red" }}>Tries {tries}</b>
          </div>
          <div className="d-flex justify-content-end">
          <button tabindex="0" className="btn" data-bs-toggle="popover" data-bs-trigger="focus" title="Instructions" data-bs-content="Click letters from left to right following the path"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={35} height={35} strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg></button>
          <button className="btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={35} height={35} strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={()=>instruction.play()}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
          </svg>
          </button>

          </div>
        </div>
          
        <canvas id="board"></canvas> 
        </>):
          <div className="Container d-flex flex-column justify-content-center">
            <h2 className="text-center">You have completed the game!</h2>
            <b className="fs-4">Time :{ (new Date()-startTimeRef.current)/1000}</b>
            <b className="fs-4">No of tries : {tries}</b>
            <Link to="/" className="btn btn-dark">Go back</Link>
          </div>}
        <div>
          {counter === 5 && show !== 3 ? (
            <button className="btn btn-dark m-2" onClick={handleNext}>
              {" "}
              Next
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
