import { render } from "./render";
import { join } from 'path'

const fps = 24;

const run = async () => {
    await render({
        animation: join("file://", __dirname, "../examples/box/index.html"),
        start: 0,
        end: fps * 30,
        viewport: {
            height: 1080,
            width: 1920,
            fps
        }
    })

    process.exit(0);
}

run();