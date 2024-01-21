import * as anime from 'animejs'


const animation = anime({
    autoplay: false,
    targets: "#background",
    left: -(1920 * 30),
    duration: 30000,
    easing: "linear"
})

export function tick(timeStep: number) {
    animation.tick(timeStep)
}