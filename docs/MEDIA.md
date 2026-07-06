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
- **Forward-only** loop (no boomerang), **linear** scroll (no easing), 10s.
- One clip **per device width**, recorded at that device's true aspect ratio
  (desktop 16:9, tablet 3:4, mobile 9:19.5) so the preview frame never crops.
- A poster `.jpg` (first frame) accompanies each clip for `<video poster>` and
  the `prefers-reduced-motion` still.
- **Lazy-load:** only the selected client's clips load; `preload="none"` /
  `metadata` until the demo scrolls into view.

**Encode reference (ffmpeg):**
```sh
# <trim> = raw duration − 10.4 (drops the page-load head; keeps the 10s scroll)
ffmpeg -ss <trim> -i raw.webm -t 10 -c:v libvpx-vp9 -crf 35 -b:v 0 \
  -an -pix_fmt yuv420p -deadline good -cpu-used 2 out.webm
# poster: ffmpeg -i out.webm -frames:v 1 -q:v 3 out-poster.jpg
```
