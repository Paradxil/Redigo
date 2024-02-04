import * as anime from "animejs";
import { icons } from "feather-icons";
import { data } from "./three-way-solution";
const { ticks } = data;

const MAP_WIDTH = 9;
const TILE_SIZE = 50;
const GAP = 10;
const SPEED = 750;
const SHOW_GRID = false;
const SETUP_INITIAL_TILES = true;
const LINE_THICKNESS = 4;

export const colors = {
  A: "#ffd8a8",
  B: "#b2f2bb",
  C: "#99e9f2",
  D: "#d0bfff",
};

enum TileType {
  Item = "item",
  Conveyor = "conveyor",
  Spawner = "spawner",
  Incinerator = "incinerator",
}

const getTileId = (id: string | number) => `tile_${id}`;
const getTileClass = (type: string) => getTileType(type);
const getTileType = (type: string): TileType => {
  if (type === "item") return TileType.Item;
  if (type === "spawner") return TileType.Spawner;
  if (type === "incinerator") return TileType.Incinerator;
  return TileType.Conveyor;
};
const getIcon = ({ type, dir }: { type: string; dir?: string }) => {
  if (type === "item") return "box";
  if (type === "spawner") return "plus";
  if (type === "incinerator") return "trash";
  return `chevrons-${dir}`;
};
const getPos = (index: number) => {
  if (index == null) {
    return {};
  }

  const y = Math.floor(index / MAP_WIDTH);
  const x = index % MAP_WIDTH;
  return {
    x: x * (TILE_SIZE + GAP + LINE_THICKNESS),
    y: y * (TILE_SIZE + GAP + LINE_THICKNESS),
  };
};

const animations = [];

let time = {
  interpolation: 0.0,
  tick: 0,
};

const timeline = anime.timeline({
  autoplay: false,
});

const container = document.getElementById("tilemap");
container.style.width = `${MAP_WIDTH * (TILE_SIZE + GAP + LINE_THICKNESS)}px`;
container.style.height = `${MAP_WIDTH * (TILE_SIZE + GAP + LINE_THICKNESS)}px`;

const els: { [key: number]: HTMLDivElement } = {};

if (SHOW_GRID) {
  Array.from({ length: MAP_WIDTH + 1 }).forEach((_, i) => {
    const line = document.createElement("div");
    line.classList.add("gridline", "vertical");
    let x = i * (TILE_SIZE + GAP + LINE_THICKNESS) - (GAP + LINE_THICKNESS) / 2;
    let y = -TILE_SIZE / 2 - (GAP + LINE_THICKNESS) / 2;
    line.style.left = `${x}px`;
    line.style.top = `${y}px`;
    line.style.width = `${LINE_THICKNESS}px`;
    line.style.height = "0px";
    line.style.opacity = "0";

    container.appendChild(line);
  });

  Array.from({ length: MAP_WIDTH + 1 }).forEach((_, i) => {
    const line = document.createElement("div");
    line.classList.add("gridline", "horizontal");
    let y = i * (TILE_SIZE + GAP + LINE_THICKNESS) - (GAP + LINE_THICKNESS) / 2;
    let x = -TILE_SIZE / 2 - (GAP + LINE_THICKNESS) / 2;
    line.style.left = `${x}px`;
    line.style.top = `${y}px`;
    line.style.height = `${LINE_THICKNESS}px`;
    line.style.width = "0px";
    line.style.opacity = "0";

    container.appendChild(line);
  });

  timeline.add({
    targets: ".gridline.vertical",
    duration: 1000,
    delay: function (_, index) {
      return 50 + index * 100;
    },
    easing: "easeInOutExpo",
    opacity: {
      value: 1,
      easing: "easeOutExpo",
    },
    height: [
      "0px",
      `${MAP_WIDTH * (TILE_SIZE + GAP + LINE_THICKNESS) + TILE_SIZE}px`,
    ],
  });

  timeline.add({
    targets: ".gridline.horizontal",
    duration: 1000,
    delay: function (_, index) {
      return 100 + index * 100;
    },
    easing: "easeInOutExpo",
    opacity: {
      value: 1,
      easing: "easeOutExpo",
    },
    width: [
      "0px",
      `${MAP_WIDTH * (TILE_SIZE + GAP + LINE_THICKNESS) + TILE_SIZE}px`,
    ],
  });
}

// timeline.add({
//   targets: ".gridline",
//   duration: 1000,
//   easing: "easeInOutExpo",
//   backgroundColor: "#2e3e4d",
// });

if (SETUP_INITIAL_TILES) {
  const { positions, tiles } = ticks[0];
  const sorted = tiles.sort((a, b) => +a.id - +b.id);
  sorted
    .filter(({ id }) => !Object.keys(els).includes(id.toString()))
    .forEach(({ id, tile }) => {
      const el = document.createElement("div");
      el.id = getTileId(id);
      el.classList.add("tile");
      el.classList.add(getTileClass(tile.type));
      el.style.opacity = "0";
      const { x, y } = getPos(positions[id]);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.color = (tile as never as { char: string })?.char
        ? colors[(tile as never as { char: string }).char]
        : "";

      const iconName = getIcon(tile);

      const icon = icons[iconName].toSvg();
      el.innerHTML = icon;

      container.appendChild(el);

      els[id] = el;
    });

  timeline.add({
    targets: ".tile",
    duration: 1000,
    delay: function (_, index) {
      return 100 + index * 200;
    },
    easing: "easeOutElastic",
    elasticity: 650,
    opacity: {
      value: 1,
      easing: "easeOutExpo",
    },
    scale: [0, 1],
  });
}

animations.push(
  anime({
    autoplay: false,
    targets: time,
    interpolation: 1.0,
    duration: SPEED,
    loop: true,
    easing: "easeInOutQuad",
    loopBegin: () => {
      time.tick += 1;
    },
  })
);

// animations.push(
//   anime({
//     autoplay: false,
//     targets: ".tile",
//     duration: 1000,
//     easing: "easeInOutQuad",
//     opacity: 1,
//     delay: function (_, index) {
//       return 75 + index * 40;
//     },
//   })
// );

// animations.push(
//   anime({
//     autoplay: false,
//     targets: "#tilemap",
//     duration: ticks.length * SPEED,
//     keyframes: [
//       {
//         left: "-3000px",
//         top: "-2000px",
//       },
//       {
//         left: "-500px",
//         top: "-3000px",
//       },
//     ],
//     easing: "easeInOutQuad",
//   })
// );

export function tick(timeStep: number, curTime: number) {
  timeline.tick(curTime);

  if (timeline.completed) {
    animations.forEach((a) => a.tick(curTime));
    //animation.tick(curTime);
  }

  if (time.tick >= ticks.length) {
    return;
  }

  const { tiles, positions } = ticks[time.tick];
  const { positions: lastPositions } =
    time.tick > 0 ? ticks[time.tick - 1] : { positions };

  tiles
    .filter(({ id }) => !Object.keys(els).includes(id.toString()))
    .forEach(({ id, tile }) => {
      const el = document.createElement("div");
      el.id = getTileId(id);
      el.classList.add("tile");
      el.classList.add(getTileClass(tile.type));
      const { x, y } = getPos(positions[id]);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.opacity = "0";
      el.style.color = (tile as never as { char: string })?.char
        ? colors[(tile as never as { char: string }).char]
        : "";

      const iconName = getIcon(tile);

      const icon = icons[iconName].toSvg({ height: TILE_SIZE * 0.75 });
      el.innerHTML = icon;

      container.appendChild(el);

      els[id] = el;

      animations.push(
        anime({
          autoplay: false,
          targets: el,
          duration: 1000,
          easing: "easeOutElastic",
          elasticity: 650,
          opacity: [0, 1],
          scale: [0, 1],
        })
      );
    });

  Object.entries(els).forEach(([id, el]) => {
    const { x, y } = getPos(positions[id]);
    const { x: lastX, y: lastY } = getPos(lastPositions[id]) ?? { x, y };

    if (x == null || y == null) {
      const opacity = Math.min(+el.style.opacity, 1.0 - time.interpolation);
      el.style.opacity = opacity.toString();
      return;
    }

    const ix = (x - lastX) * time.interpolation + lastX;
    const iy = (y - lastY) * time.interpolation + lastY;
    //const opacity = Math.max(+el.style.opacity, time.interpolation);

    el.style.left = `${ix}px`;
    el.style.top = `${iy}px`;
    // el.style.opacity = opacity.toString();
  });
}
