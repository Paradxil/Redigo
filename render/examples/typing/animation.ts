import * as anime from "animejs";
import { texts } from "./content";
import hljs from "highlight.js";

const highlight_lines = [4];

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

const timeline = anime.timeline({
  autoplay: false,
});

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
let totalTime = 0;

export function tick(timeStep: number, time: number) {
  curTime += timeStep;
  if (curTime >= curDelay && curChar < texts[0].length) {
    curChar += 1;
    const content = texts[0].slice(0, curChar);
    const highlighted = hljs.highlight(content, {
      language: "rust",
    }).value;
    container.innerHTML =
      `<div class="line"><div class="content">` +
      highlighted
        .split(/\n/g)
        .join(
          '</div><div class="inner-line"></div></div><div class="line"><div class="content">'
        ) +
      '</div><div class="inner-line"></div></div>';
    curTime = curTime - curDelay;
    totalTime += timeStep;
  } else {
    if (
      highlight_lines?.length &&
      (animations.length === 0 || animations.every((a) => a.completed))
    ) {
      const index = highlight_lines.pop();
      const els = document.getElementsByClassName("inner-line");
      if (index >= 0 && index < els.length) {
        animations.push(
          anime({
            autoplay: false,
            delay: 100,
            targets: els.item(index),
            duration: 4000,
            scaleX: [
              { value: 0, duration: 0 },
              { value: 1, duration: 750 },
              { value: 0, delay: 2500 },
            ],
            easing: "easeOutQuad",
          })
        );
      }
    }
    animations.forEach((a) => a.tick(time));
  }

  return { curChar, curDelay, curTime, timeStep };
}
