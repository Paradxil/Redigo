import { spawn } from "child_process";
import { existsSync, writeFileSync, createWriteStream } from "fs";
import { join } from "path";
import { render } from "../src/render";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

const renderExample = async (example: string, fps: number, seconds: number) => {
  const exampleDir = join(__dirname, `./${example}`);
  const animationScript = `${exampleDir}/animation.ts`;
  const compiledScript = `${exampleDir}/animation.js`;
  if (!existsSync(exampleDir) || !existsSync(animationScript)) {
    console.log("Cannot find animation.");
    process.exit(1);
  }

  const tsc = spawn("npx", ["tsc", animationScript], { stdio: "inherit" });
  await new Promise((resolve) => tsc.once("exit", resolve));

  const cmd = spawn("npx", [
    "browserify",
    compiledScript,
    "--standalone",
    "ANI",
  ]);
  const file = createWriteStream(`${exampleDir}/bundle.js`);
  cmd.stdout.pipe(file);

  await new Promise((resolve) => cmd.once("exit", resolve));
  file.close();

  await render({
    animation: join("file://", exampleDir, "index.html"),
    start: 0,
    end: fps * seconds,
    viewport: {
      height: 1080,
      width: 1920,
      fps,
    },
  });

  process.exit(0);
};

const argv: {
  name: string;
  seconds: number;
  fps: number;
} = yargs(hideBin(process.argv))
  .default("name", "conveyors")
  .default("fps", 60)
  .default("seconds", 10)
  .parse() as never;
renderExample(argv.name, argv.fps, argv.seconds);
