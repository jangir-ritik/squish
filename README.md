# Squish 🗜️

**Batch image compression that stays local. No uploads, no subscriptions, no nonsense.**

Squish is a free, open-source desktop app for compressing and converting images in bulk — entirely on your machine. Drop in your files, pick your settings, and get smaller images in seconds.

---

## Why Squish?

Every other tool makes you choose between:

- **Browser tools** (Squoosh, TinyPNG) — no batch processing, your images leave your machine
- **Mac-only apps** (ImageOptim) — not for everyone
- **CLI tools** (Sharp, ImageMagick) — powerful but no UI

Squish hits the gap: **batch input + format conversion + local processing + good UX**, on Windows and Linux.

---

## Features

- 🖼️ **Batch processing** — drop in as many images as you want
- 🔄 **Format conversion** — compress to WebP, JPEG, or PNG
- 📐 **Optional resize** — set max width/height with cover/contain/fill fit modes
- ⚡ **Fast** — processes 4 images concurrently using Sharp's native C++ bindings
- 🔒 **100% local** — your images never leave your machine
- 🧹 **Strip metadata** — removes EXIF, GPS, and ICC data by default

---

## Download

Go to [Releases](../../releases) and grab the latest version:

| Platform            | File                     |
| ------------------- | ------------------------ |
| Windows (installer) | `Squish Setup 0.1.0.exe` |
| Windows (portable)  | `Squish 0.1.0.exe`       |

> **Windows note:** You may see a SmartScreen warning on first launch — click **More info → Run anyway**. This happens because the app isn't code-signed yet. It's safe.

---

## How to Use

1. **Drop** your images onto the drop zone (or click Browse)
2. **Configure** — pick output format, quality, and optional resize
3. **Run** — watch the progress bar, see per-file savings
4. **Done** — open the output folder directly from the app

---

## Building from Source

**Requirements:** Node.js 20+, pnpm

```bash
git clone https://github.com/YOURUSERNAME/squish.git
cd squish
pnpm install
pnpm approve-builds   # allow Sharp and Electron to build native modules
pnpm dev              # launch in development mode
pnpm build            # build installers to release/
```

---

## Tech Stack

- [Electron](https://electronjs.org) — desktop shell
- [React](https://react.dev) + [Vite](https://vitejs.dev) — renderer
- [Sharp](https://sharp.pixelplumbing.com) — image processing (native C++)
- [shadcn/ui](https://ui.shadcn.com) + [Radix](https://radix-ui.com) — UI components
- [Tailwind CSS](https://tailwindcss.com) — styling

---

## Roadmap

- [ ] AVIF output support
- [ ] Drag-in whole folders
- [ ] Before/after size preview per file
- [ ] Selective EXIF preservation (keep copyright, strip GPS)
- [ ] Watermarking
- [ ] macOS support

---

## License

MIT — do whatever you want with it.

---

Made by [Ritik Jangir](https://github.com/YOURUSERNAME)
