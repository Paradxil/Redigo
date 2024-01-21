import * as anime from "animejs";
import { readFileSync } from "fs";
import { join } from "path";
import { moves, tiles } from "./header";
import { icons } from "feather-icons";

const MAP_WIDTH = 50;
const TILE_SIZE = 40;
const GAP = 10;
const SPEED = 500;

enum TileType {
  Item = "item",
  Conveyor = "conveyor",
}

const getTileId = (id: string) => `tile_${id}`;
const getTileClass = (type: string) => getTileType(type);
const getTileType = (type: string): TileType => {
  if (type === "item") return TileType.Item;
  return TileType.Conveyor;
};
const getPos = (index: number) => {
  const y = Math.floor(index / MAP_WIDTH);
  const x = index % MAP_WIDTH;
  return { x: x * (TILE_SIZE + GAP), y: y * (TILE_SIZE + GAP) };
};

const tileTypes = tiles
  .split("\n")
  .filter((s) => s?.length)
  .map((tile) => tile.split(":"))
  .reduce(
    (out, [id, type]) => ({
      ...out,
      [id]: type,
    }),
    {}
  );

const ticks: Record<number, number>[] = moves
  .split("---")
  .filter((v) => v?.length)
  .map((s) =>
    s
      .split("\n")
      .filter((s) => s?.length)
      .map((m) => m.split(":").map((m) => +m))
      .reduce(
        (out, [id, index]) => ({
          ...out,
          [id]: index,
        }),
        {}
      )
  );

const container = document.getElementById("tilemap");
const els = Object.entries(tileTypes).map(([id, type]) => {
  const el = document.createElement("div");
  el.id = getTileId(id);
  el.classList.add("tile");
  el.classList.add(getTileClass(type as string));
  el.style.opacity = "1";
  const { x, y } = getPos(ticks[0][id]);
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;

  const iconName = type === "item" ? "box" : `chevrons-${type}`;

  const icon = icons[iconName].toSvg();
  el.innerHTML = icon;

  container.appendChild(el);
});

const animations = Object.keys(tileTypes)
  .sort((a, b) => {
    let t1 = getTileType(a[1]);
    let t2 = getTileType(b[2]);
    if (t1 === TileType.Conveyor && t2 === TileType.Item) {
      return 1;
    }
    if (t1 === TileType.Item && t2 === TileType.Conveyor) {
      return -1;
    }
    return 0;
  })
  .map((id, index) =>
    anime({
      autoplay: true,
      targets: `#${getTileId(id)}`,
      duration: ticks.length * SPEED,
      keyframes: [
        // {
        //   delay: index * 5,
        //   opacity: 1,
        //   duration: 250,
        // },
        // {
        //   delay: (Object.keys(tileTypes).length - index) * 5,
        // },
        ...ticks.map((tick) => {
          const { x, y } = getPos(tick[id]);
          return {
            left: `${x}px`,
            top: `${y}px`,
            duration: SPEED,
          };
        }),
      ],
      easing: "easeInOutQuad",
    })
  );

export function tick(timeStep: number) {
  animations.forEach((a) => a.tick(timeStep));
}
