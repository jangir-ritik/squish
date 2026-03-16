# Batch Image Optimizer

A desktop application built with Electron, React, and Vite that optimizes and converts images in batch using Sharp. Features three intuitive screens: drop zone for file selection, configuration panel for optimization settings, and real-time progress tracking.

## Features

- **Drag & Drop Interface**: Easily select multiple images via drag-and-drop or file browser
- **Multiple Format Support**: Convert to WebP, JPEG, PNG with customizable quality
- **Image Resizing**: Optional image resizing with aspect ratio preservation
- **Batch Processing**: Optimize multiple images in parallel (up to 4 concurrent)
- **Real-Time Progress**: Live progress tracking with file-by-file updates
- **Modern UI**: Built with shadcn/ui, Radix UI, and Tailwind CSS

## Tech Stack

- **Frontend**: React 19 + Vite
- **Desktop**: Electron 31
- **Image Processing**: Sharp
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS 4
- **Type Safety**: TypeScript

## Project Structure

```
src/
├── main/                    # Electron main process
│   ├── index.ts            # App entry point
│   ├── preload.ts          # Context bridge for IPC
│   ├── ipc-handlers.ts     # Sharp processing logic
│   └── utils.ts            # Utility functions
└── renderer/               # React frontend
    ├── main.tsx            # React entry point
    ├── App.tsx             # Main app component with state
    ├── types.ts            # TypeScript definitions
    └── components/
        ├── DropZone.tsx    # File selection screen
        ├── ConfigPanel.tsx # Settings screen
        └── ProgressView.tsx # Progress tracking screen
```

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Python 3.x (required by Sharp for native bindings)

### Installation

1. Clone the repository:
```bash
git clone <repo-url>
cd batchImageOptimizer
```

2. Install dependencies:
```bash
pnpm install
```

### Development

Start the development server with hot reload:

```bash
pnpm dev
```

This command:
- Starts Vite dev server on `http://localhost:5173`
- Automatically opens Electron after Vite is ready
- Enables dev tools for debugging

### Building

Create a production build:

```bash
pnpm build
```

This will:
1. Build the React app with Vite
2. Compile the Electron main process
3. Package everything with electron-builder

## Architecture

### IPC Communication

The app uses Electron's IPC with context bridge for secure inter-process communication:

- **Main Process**: Handles file I/O and Sharp image processing
- **Renderer Process**: React UI, file selection, progress display
- **Context Bridge**: Exposes safe API to renderer

### Image Processing Pipeline

1. User selects images via drop zone
2. Configures optimization settings (format, quality, resize)
3. Sends files and config to main process via IPC
4. Main process processes images in parallel (4 concurrent)
5. Sends progress updates after each file
6. Returns output directory path on completion

### State Management

Uses React hooks with `useState` to manage three screens:
- `dropzone`: File selection
- `config`: Optimization settings  
- `progress`: Real-time progress tracking

## Configuration

### Optimization Settings

- **Format**: WebP (best compression), JPEG (compatibility), PNG (lossless)
- **Quality**: 10-100% (default: 80)
- **Resize**: Optional image resizing with max dimensions
- **Concurrency**: 4 images processed simultaneously

### Output

Optimized images are saved to `original_folder/optimized_TIMESTAMP/`

## API Reference

### Window.api

The exposed IPC API:

```typescript
window.api.optimizeImages(files, config) -> Promise
window.api.onProgress(callback) -> void
window.api.onComplete(callback) -> void
window.api.onError(callback) -> void
window.api.cancelOptimization() -> Promise
window.api.openOutputFolder(path) -> Promise
```

## Troubleshooting

### Sharp compilation errors
If you see Sharp build errors, ensure Python 3.x is installed and in your PATH.

### File access issues
On macOS/Linux, you may need to grant file access permissions in System Preferences.

### Electron not starting
Clear `node_modules` and reinstall with `pnpm install`, then try `pnpm dev` again.

## License

MIT
