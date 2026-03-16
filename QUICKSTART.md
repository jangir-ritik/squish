# Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start Development
```bash
pnpm dev
```

The app will automatically:
- Start Vite dev server on port 5173
- Launch Electron with dev tools open
- Enable hot module replacement (HMR)

### 3. Start Optimizing

1. **Drop Zone** → Drag images or click "Select Images"
2. **Config** → Choose format (WebP/JPEG/PNG), quality (10-100%), optionally resize
3. **Progress** → Watch real-time progress, then open the output folder

## Directory Outputs

Optimized images are saved to:
```
<original_folder>/optimized_<TIMESTAMP>/
```

Example:
```
~/Pictures/vacation/
├── beach.jpg
├── sunset.png
└── optimized_1699123456789/
    ├── beach.webp
    └── sunset.webp
```

## Build for Distribution

```bash
pnpm build
```

Creates platform-specific installers in `dist/`:
- **Windows**: `.exe` installer + portable version
- **macOS**: `.dmg` (DMG file)
- **Linux**: `.AppImage` + `.deb`

## Project Files

Essential files to understand:

| File | Purpose |
|------|---------|
| `src/main/index.ts` | Electron app entry, window setup |
| `src/main/ipc-handlers.ts` | Sharp image processing logic |
| `src/renderer/App.tsx` | React app, screen state management |
| `src/renderer/components/` | Three UI screens |
| `tailwind.config.ts` | Tailwind theme configuration |

## Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

### Sharp compilation fails
Ensure Python 3.x is installed:
```bash
python3 --version  # Should be 3.8+
```

### Changes not showing
- Renderer changes: Auto-reload (HMR)
- Main process changes: Restart Electron manually
- Vite config changes: Restart `pnpm dev`

## Configuration

Edit `src/main/ipc-handlers.ts` to customize:

```typescript
// Line 30: Change concurrency
const limit = pLimit(6)  // More aggressive processing

// Line 63: Adjust resize behavior
image.resize(config.width, config.height, {
  fit: 'cover',  // Change from 'inside'
  withoutEnlargement: false
})
```

## Common Tasks

### Add a new image format
In `src/main/ipc-handlers.ts`, add to processImage:
```typescript
} else if (config.format === 'avif') {
  image = image.avif({ quality: config.quality })
}
```

### Customize UI colors
Edit `src/styles/globals.css`:
```css
:root {
  --primary: oklch(0.6 0.15 200);  /* Change hue */
}
```

### Add settings persistence
Wrap App config with localStorage or use electron-store:
```bash
pnpm add electron-store
```

## Next Steps

- Read `README.md` for detailed documentation
- Check `IMPLEMENTATION.md` for architecture details
- Review React components for UI patterns
- Explore `src/main/ipc-handlers.ts` for processing logic

Happy optimizing!
