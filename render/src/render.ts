import { launch } from "puppeteer";
import { spawn } from "child_process";
import { join } from "path";
import { writeFileSync } from "fs";

export type RenderOptions = {
  animation: string; // Path to html file containing the animation to render.
  viewport: { width: number; height: number; scale?: number; fps: number };
  start: number;
  end: number;
  out?: string;
};

export const render = async ({
  animation,
  start,
  end,
  viewport: { width, height, scale, fps },
  out,
}: RenderOptions) => {
  const browser = await launch({
    headless: "new",
  });
  const page = await browser.newPage();
  const session = await page.createCDPSession();
  await page.goto(animation, {
    timeout: 300000,
    waitUntil: "load",
  });
  await page.setViewport({
    height,
    width,
    deviceScaleFactor: scale ?? 1,
  });
  session.send("Animation.setPlaybackRate", { playbackRate: 0.0 });

  const basePath = out ?? join(__dirname, `../out/${Date.now()}`);
  const timeStep = 1000 / fps;

  const { writePNGFrame, close } = ffmpegOutput(fps, `${basePath}.mov`);

  for (let curFrame = start; curFrame < end; curFrame += 1) {
    console.log("Starting render", {
      time: timeStep * curFrame,
      frame: curFrame,
    });

    const curTime = timeStep * curFrame;

    const animations = await page.evaluate((curTime: number) => {
      const els = Array.from(document.getElementsByClassName("animated"));
      const animations = els.map((el) => el.getAnimations()).flat(2);
      animations.forEach((a) => {
        a.pause();
        a.currentTime = curTime;
      });
      return animations;
    }, curTime);

    const data = await page.evaluate(`ANI.tick(${timeStep})`);

    console.log("Rendering frame", { data });

    const buffer = await page.screenshot({
      clip: {
        x: 0,
        y: 0,
        width,
        height,
      },
      omitBackground: true,
    });

    //writeFileSync(`${basePath}_${curFrame}.png`, buffer);
    writePNGFrame(buffer);
  }
  close();
};

function ffmpegOutput(fps: number, outPath: string) {
  const ffmpeg = spawn("ffmpeg", [
    ...["-f", "image2pipe"],
    ...["-framerate", `${fps}`],
    ...["-i", "-"],

    ...[
      // https://stackoverflow.com/a/12951156/559913
      ...["-c:v", "qtrle"],

      // https://unix.stackexchange.com/a/111897
      // ...['-c:v', 'prores_ks'],
      // ...['-pix_fmt', 'yuva444p10le'],
      // ...['-profile:v', '4444'],
      // https://www.ffmpeg.org/ffmpeg-codecs.html#Speed-considerations
      // ...['-qscale', '4']
    ],

    "-y",
    outPath,
  ]);
  ffmpeg.stderr.pipe(process.stderr);
  ffmpeg.stdout.pipe(process.stdout);
  return {
    writePNGFrame(buffer: Buffer) {
      ffmpeg.stdin.write(buffer);
    },
    close() {
      ffmpeg.stdin.end();
    },
  };
}
