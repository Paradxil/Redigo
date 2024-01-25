import * as anime from "animejs";
import { icons } from "feather-icons";
import { data } from "./data";
const ticks: {
  positions: { [key: number]: number };
  tiles: { id: number; tile: string }[];
}[] = data.ticks;

const MAP_WIDTH = 100;
const TILE_SIZE = 40;
const GAP = 10;
const SPEED = 500;

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
const getIcon = (type: string) => {
  if (type === "item") return "box";
  if (type === "spawner") return "plus";
  if (type === "incinerator") return "trash";
  return `chevrons-${type}`;
};
const getPos = (index: number) => {
  if (index == null) {
    return {};
  }

  const y = Math.floor(index / MAP_WIDTH);
  const x = index % MAP_WIDTH;
  return { x: x * (TILE_SIZE + GAP), y: y * (TILE_SIZE + GAP) };
};

// const tileTypes = tiles
//   .split("\n")
//   .filter((s) => s?.length)
//   .map((tile) => tile.split(":"))
//   .reduce(
//     (out, [id, type]) => ({
//       ...out,
//       [id]: type,
//     }),
//     {}
//   );

// const ticks: Record<number, number>[] = moves
//   .split("---")
//   .filter((v) => v?.length)
//   .map((s) =>
//     s
//       .split("\n")
//       .filter((s) => s?.length)
//       .map((m) => m.split(":").map((m) => +m))
//       .reduce(
//         (out, [id, index]) => ({
//           ...out,
//           [id]: index,
//         }),
//         {}
//       )
//   );

// const els = Object.entries(tileTypes).map(([id, type]) => {
//   const el = document.createElement("div");
//   el.id = getTileId(id);
//   el.classList.add("tile");
//   el.classList.add(getTileClass(type as string));
//   el.style.opacity = "1";
//   const { x, y } = getPos(ticks[0][id]);
//   el.style.left = `${x}px`;
//   el.style.top = `${y}px`;

//   const iconName = type === "item" ? "box" : `chevrons-${type}`;

//   const icon = icons[iconName].toSvg();
//   el.innerHTML = icon;

//   container.appendChild(el);
// });

// const animations = Object.keys(tileTypes)
//   .sort((a, b) => {
//     let t1 = getTileType(a[1]);
//     let t2 = getTileType(b[2]);
//     if (t1 === TileType.Conveyor && t2 === TileType.Item) {
//       return 1;
//     }
//     if (t1 === TileType.Item && t2 === TileType.Conveyor) {
//       return -1;
//     }
//     return 0;
//   })
//   .map((id, index) =>
//     anime({
//       autoplay: false,
//       targets: `#${getTileId(id)}`,
//       duration: ticks.length * SPEED,
//       keyframes: [
//         // {
//         //   delay: index * 5,
//         //   opacity: 1,
//         //   duration: 250,
//         // },
//         // {
//         //   delay: (Object.keys(tileTypes).length - index) * 5,
//         // },
//         ...ticks.map((tick) => {
//           const { x, y } = getPos(tick[id]);
//           return {
//             left: `${x}px`,
//             top: `${y}px`,
//             duration: SPEED,
//           };
//         }),
//       ],
//       easing: "easeInOutQuad",
//     })
//  );

const animations = [];

let time = {
  interpolation: 0.0,
  tick: 1,
};

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
      // if (time.tick >= ticks.length) {
      //   return;
      // }

      // const { tiles, positions } = ticks[time.tick];

      // tiles
      //   .filter(({ id }) => !Object.keys(els).includes(id.toString()))
      //   .forEach(({ id, tile }) => {
      //     const container = document.getElementById("tilemap");
      //     const el = document.createElement("div");
      //     el.id = getTileId(id);
      //     el.classList.add("tile");
      //     el.classList.add("animated");
      //     el.classList.add(getTileClass(tile));
      //     el.style.transform = "translateY(-10px)";
      //     el.style.opacity = "0";
      //     const { x, y } = getPos(positions[id]);
      //     el.style.left = `${x}px`;
      //     el.style.top = `${y}px`;

      //     const iconName = getIcon(tile);

      //     const icon = icons[iconName].toSvg();
      //     el.innerHTML = icon;

      //     container.appendChild(el);

      //     els[id] = el;
      //   });

      // Object.entries(els).forEach(([id, el]) => {
      //   const { x, y } = getPos(positions[id]);

      //   if (x == null || y == null) {
      //     el.classList.add("deleted");
      //     return;
      //   }

      //   // const opacity = Math.max(+el.style.opacity, time.interpolation);
      //   // const transform = Math.min(
      //   //   parseInt(el.style.transform.replace(/[^\d]/gi, ""), 10),
      //   //   10 - time.interpolation * 10
      //   // );
      //   el.style.left = `${x}px`;
      //   el.style.top = `${y}px`;
      // });
    },
  })
);

animations.push(
  anime({
    autoplay: false,
    targets: "#tilemap",
    duration: ticks.length * SPEED,
    keyframes: [
      {
        left: "-3000px",
        top: "-2000px",
      },
      {
        left: "-500px",
        top: "-3000px",
      },
    ],
    easing: "easeInOutQuad",
  })
);

const els: { [key: number]: HTMLDivElement } = {};

export function tick(timeStep: number) {
  animations.forEach((a) => a.tick(timeStep));

  if (time.tick >= ticks.length) {
    return;
  }

  const { tiles, positions } = ticks[time.tick];

  const { positions: lastPositions } = ticks[time.tick - 1];

  tiles
    .filter(({ id }) => !Object.keys(els).includes(id.toString()))
    .forEach(({ id, tile }) => {
      const container = document.getElementById("tilemap");
      const el = document.createElement("div");
      el.id = getTileId(id);
      el.classList.add("tile");
      el.classList.add(getTileClass(tile));
      el.style.transform = "translateY(-10px)";
      el.style.opacity = "0";
      const { x, y } = getPos(positions[id]);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;

      const iconName = getIcon(tile);

      const icon = icons[iconName].toSvg();
      el.innerHTML = icon;

      container.appendChild(el);

      els[id] = el;
    });

  Object.entries(els).forEach(([id, el]) => {
    const { x, y } = getPos(positions[id]);
    const { x: lastX, y: lastY } = getPos(lastPositions[id]) ?? { x, y };

    if (x == null || y == null) {
      el.classList.add("deleted");
      return;
    }

    const ix = (x - lastX) * time.interpolation + lastX;
    const iy = (y - lastY) * time.interpolation + lastY;
    const opacity = Math.max(+el.style.opacity, time.interpolation);
    const transform = Math.min(
      parseInt(el.style.transform.replace(/[^\d]/gi, ""), 10),
      10 - time.interpolation * 10
    );
    el.style.left = `${ix}px`;
    el.style.top = `${iy}px`;
    el.style.transform = `translateY(-${transform}px)`;
    el.style.opacity = opacity.toString();
  });
}
