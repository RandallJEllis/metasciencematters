# Metascience Matters website

A responsive static podcast homepage. EB Garamond is the single typeface, with navy text, ivory backgrounds, and original color episode thumbnails. No package install, API keys, build service, or backend required.

## Preview

From this folder, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. Stop the server with Ctrl+C.

## Features

- Featured YouTube video and an archive of 13 verified conversations.
- Guest/title/topic search and a show-all control.
- Click-to-load YouTube and Spotify embeds; direct platform links always remain available.
- Substack profile, episode notes, and the real Substack subscription page.
- Real email link for guest suggestions and feedback.
- Responsive navigation, keyboard controls, reduced-motion support, and readable content without JavaScript.

Episode details were checked against the public YouTube channel and Substack on October 16, 2026. The dates in the archive are Substack publication dates; some older conversations were republished there. This is a static selection: new episodes do not automatically appear in the archive. The Spotify show player and platform homepages offer the current catalogs.

## Add or edit episodes

1. Edit `episodes.json`. Add the YouTube video ID, guest, title, duration, Substack publication date and notes URL. Supported topic keys are `integrity`, `replication`, and `data`; episodes can have multiple topics.
2. Save the 16:9 episode thumbnail as `assets/episodes/VIDEO_ID.jpg`.
3. Run `python3 scripts/render_episodes.py` to update the static HTML and episode count.
4. To change the featured conversation, update the `.featured` block in `index.html`, including its image, `data-video`, `data-title`, date, guest, title, YouTube URL, and show-notes URL.

Styles live in `style.css`; interactions live in `script.js`. The existing original artwork is preserved in `logo.png` and `x_banner.png`; the page uses a smaller optimized copy in `assets/podcast-art.jpg`.

## Hosting

Serve this folder with any static host, including GitHub Pages. There is no build step for visitors. Deploy `index.html`, `style.css`, `script.js`, `assets/`, and `favicon/`. Keep `episodes.json` and `scripts/` with the source for future edits; the ZIP archives are not needed on the host.

Players connect to YouTube or Spotify only after the visitor requests them. Embedded playback depends on the platform, browser settings, and the video's embedding permissions. Direct YouTube, Spotify, and Substack links provide a fallback. Google Fonts supplies EB Garamond, with Baskerville, Palatino, and Georgia fallbacks if it cannot load.

Source repository: [RandallJEllis/metasciencematters](https://github.com/RandallJEllis/metasciencematters).
