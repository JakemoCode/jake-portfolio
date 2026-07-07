# Media conventions

## Client-site preview videos — VP9 WebM only

Every client-site preview clip (the "See it adapt" demo, and any future
site video) is captured and encoded as **VP9 in WebM — and only WebM. No MP4.**

**Why.** VP9 is ~2× more efficient than H.264 for these simple site-scroll
clips. Measured on the identical Arbor clip: the H.264 `.mp4` ran **797 kbps /
1.57 MB**, the VP9 `.webm` **367 kbps / 722 KB**. Shipping *both* formats also
made browsers download the redundant one — Lighthouse flagged **~4 MB** of video
payload on the landing page. WebM/VP9 is supported by Chrome, Firefox, Edge, and
Safari 14.1+ (2021) — ~97% of browsers — so one WebM covers everyone worth
covering. No mp4 fallback; drop the `<source type="video/mp4">`.

**Standard.**
- Container / codec: **WebM / VP9**, audio stripped (`-an`).
- Constant quality: **CRF ~35** (`-crf 35 -b:v 0`), which lands ~300–400 kbps
  for these scroll clips — the right VP9 rate control (a fixed `-b:v` overshoots).
- **Forward-only** loop (no boomerang), **linear** scroll (no easing), 10s, 30 fps.
- One clip **per device width**, captured at that device's true aspect ratio
  (desktop 16:9, tablet 3:4, mobile 9:19.5) so the preview frame never crops.
- **Capture by screenshotting each frame** at an evenly-spaced scroll position
  (deterministic → perfectly even motion). Do NOT use Playwright's `recordVideo`:
  it's 25 fps and samples frames independently of the scroll, so the motion
  comes out jittery. Set `scroll-behavior: auto` first (client sites set it to
  `smooth`, which fights per-frame scrolling), and pre-warm by bouncing to the
  bottom so lazy media loads before the timed scroll.
- **PNG intermediates**, not JPEG — JPEG noise between frames wrecks VP9's
  inter-frame compression (3.3 MB with JPEG vs 0.6 MB with PNG for one clip).
- A poster `.jpg` (first frame) accompanies each clip for `<video poster>` and
  the `prefers-reduced-motion` still.
- **Lazy-load:** only the selected client's clips load; `preload="none"` /
  `metadata` until the demo scrolls into view.

**Encode reference (ffmpeg):** assemble from the PNG frame sequence.
```sh
ffmpeg -framerate 30 -i frames/%04d.png -c:v libvpx-vp9 -crf 35 -b:v 0 \
  -an -pix_fmt yuv420p -deadline good -cpu-used 2 out.webm
# poster: ffmpeg -i out.webm -frames:v 1 -q:v 3 out-poster.jpg
```
