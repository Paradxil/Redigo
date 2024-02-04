export const texts = [
  `
pub trait Tile: Any {
  fn tick(&self, tick: Tick) -> TickResult;
  fn format(&self) -> (char, Color, Color, usize);
  fn priority(&self, tick_count: usize) -> usize;
}
`,
];
