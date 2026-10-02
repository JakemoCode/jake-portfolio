// Turns set type into points for the glyph mesh: the text is drawn on an
// offscreen canvas in the page's own font and the inked pixels are read back
// on a jittered grid, so the mesh reads as grown rather than ruled.
import type { GlyphPoint } from "./glyphField";

/** Sampling step as a share of the font size: about three nodes across a stroke */
export const STEP_SHARE = 1 / 21;

type Font = { style: string; weight: string; family: string; letterSpacing: string; size: number };
type Box = { x: number; y: number; width: number; height: number };

const fontOf = (style: CSSStyleDeclaration): Font => ({
  style: style.fontStyle,
  weight: style.fontWeight,
  family: style.fontFamily,
  letterSpacing: style.letterSpacing,
  size: parseFloat(style.fontSize),
});

const contextFor = (width: number, height: number, font: Font) => {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.ceil(width));
  canvas.height = Math.max(1, Math.ceil(height));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.font = `${font.style} ${font.weight} ${font.size}px ${font.family}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = font.letterSpacing;
  return ctx;
};

/** One line of text set in `box` (hero coordinates), the way CSS would set it there */
function sampleLine(text: string, font: Font, box: Box, step: number): GlyphPoint[] {
  const ctx = contextFor(box.width, box.height, font);
  if (!ctx) return [];
  const metrics = ctx.measureText(text);
  // CSS centers the font's ascent plus descent in the line box
  const ascent = metrics.fontBoundingBoxAscent;
  const baseline = (box.height - (ascent + metrics.fontBoundingBoxDescent)) / 2 + ascent;
  ctx.fillText(text, 0, baseline);
  const { data, width, height } = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  let seed = 1;
  const jitter = () => ((seed = (seed * 16807) % 2147483647) / 2147483647 - 0.5) * step * 0.7;
  const points: GlyphPoint[] = [];
  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      const px = Math.round(x + jitter());
      const py = Math.round(y + jitter());
      if (px < 0 || py < 0 || px >= width || py >= height) continue;
      if (data[(py * width + px) * 4 + 3]! > 140) points.push({ x: box.x + px, y: box.y + py });
    }
  }
  return points;
}

/** The name's letterforms, from each line's real box and font */
export function sampleName(lines: HTMLElement[], host: HTMLElement): { points: GlyphPoint[]; step: number } {
  const origin = host.getBoundingClientRect();
  let step = 8;
  const points = lines.flatMap((line) => {
    const box = line.getBoundingClientRect();
    const font = fontOf(getComputedStyle(line));
    step = Math.max(5, font.size * STEP_SHARE);
    const at = { x: box.left - origin.left, y: box.top - origin.top, width: box.width, height: box.height };
    return sampleLine(line.textContent ?? "", font, at, step);
  });
  return { points, step };
}
