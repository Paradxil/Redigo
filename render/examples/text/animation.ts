import * as anime from "animejs";

const text = "DEVLOG 1";

const wrapperEl = document.getElementById("wrapper");

Array.from({ length: text.length }).forEach((_, i) => {
  const span = document.createElement("span");
  span.innerText = text.charAt(i);
  span.style.opacity = "0";
  if (text.charAt(i) === " ") {
    span.style.display = "unset";
  }
  wrapperEl.appendChild(span);
});

// const animation = anime({
//   autoplay: false,
//   targets: "span",
//   duration: 1000,
//   delay: function (el, index) {
//     return 75 + index * 40;
//   },
//   easing: "easeOutElastic",
//   elasticity: 650,
//   opacity: {
//     value: 1,
//     easing: "easeOutExpo",
//   },
//   translateY: ["50px", "0px"],
// });

const animation = anime({
  autoplay: false,
  targets: "span",
  duration: 1000,
  delay: function (el, index) {
    return 75 + index * 40;
  },
  easing: "easeOutElastic",
  elasticity: 650,
  opacity: {
    value: 1,
    easing: "easeOutExpo",
  },
  translateX: ["30px", "0px"],
});

export function tick(timeStep: number, curTime: number) {
  animation.tick(curTime);
}
