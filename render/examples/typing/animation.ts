import * as anime from "animejs";
import { texts } from "./content";
import hljs from "highlight.js";

const rules = [
  { matcher: /[asdfghjkl]/i, speed: 20 },
  { matcher: /[qwertyuiopzxcvbnm]/i, speed: 30 },
  { matcher: /[0-9]/i, speed: 30 },
  { matcher: /[\W]/i, speed: 200 },
];
const TYPING_SPEED = 30;

const getCharSpeed = (c: string) => {
  const match = rules.find(({ matcher }) => matcher.test(c));
  console.log({
    match,
    c,
  });
  return match?.speed ?? TYPING_SPEED;
};

const container = document.getElementById("content");

const animations = [];

// animations.push(
//   anime({
//     autoplay: true,
//     loop: true,
//     duration: 30,
//     loopBegin: () => {
//       tick(30);
//     },
//   })
// );

let curChar = 0;
let curTime = 0;
let curDelay = TYPING_SPEED;

export function tick(timeStep: number) {
  //animations.forEach((a) => a.tick(timeStep));
  curTime += timeStep;

  if (curTime >= curDelay) {
    curChar += 1;
    if (curChar >= texts[0].length) {
      return;
    }
    const content = texts[0].slice(0, curChar);
    const highlighted = hljs.highlight(content, {
      language: "rust",
    }).value;
    container.innerHTML = highlighted;

    //curDelay = getCharSpeed(texts[0].at(curChar));
    console.log(curDelay);
    curTime = curTime - curDelay;
  }
  return { curChar, curDelay, curTime, timeStep };
}
