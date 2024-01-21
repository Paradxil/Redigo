import { spawnSync } from "child_process";
import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { render } from "../src/render";

const renderExample = async (example: string) => {
  const exampleDir = join(__dirname, `./${example}`);
  const animationScript = `${exampleDir}/animation.ts`;
  const compiledScript = `${exampleDir}/animation.js`;
  if (!existsSync(exampleDir) || !existsSync(animationScript)) {
    console.log("Cannot find animation.");
    process.exit(1);
  }

  spawnSync(`npx`, ["tsc", animationScript]);
  const out = spawnSync("npx", [
    "browserify",
    compiledScript,
    "--standalone",
    "ANI",
  ]);
  writeFileSync(`${exampleDir}/bundle.js`, out.stdout);

  const fps = 60;

  await render({
    animation: join("file://", exampleDir, "index.html"),
    start: 0,
    end: fps * 10,
    viewport: {
      height: 1080,
      width: 1920,
      fps,
    },
  });

  process.exit(0);
};

const example = process.argv[2];
renderExample(example);
