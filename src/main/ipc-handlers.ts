import { ipcMain, BrowserWindow, shell } from "electron";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import pLimit from "p-limit";

let cancellationRequested = false;

export function setupIpcHandlers() {
  ipcMain.handle("optimize-images", async (event, { files, config }) => {
    try {
      cancellationRequested = false;
      const window = BrowserWindow.fromWebContents(event.sender);
      if (!window) throw new Error("Window not found");

      const limit = pLimit(4);
      const tasks = files.map(
        (file: { path: string; name: string }, index: number) =>
          limit(() => processImage(file, config, window, index, files.length)),
      );
      await Promise.all(tasks);

      if (!cancellationRequested) {
        // determine outputDir for the "open folder" button
        const outputDir = resolveOutputDir(files[0], config);
        window.webContents.send("complete", { outputDir });
      }
      return { success: true };
    } catch (error) {
      const window = BrowserWindow.fromWebContents(event.sender);
      window?.webContents.send(
        "error",
        error instanceof Error ? error.message : "Unknown error",
      );
      throw error;
    }
  });

  ipcMain.handle("cancel-optimization", () => {
    cancellationRequested = true;
  });

  ipcMain.handle("open-folder", async (_, folderPath) => {
    shell.openPath(folderPath);
    return { success: true };
  });
}

function applyRenamePattern(pattern: string, originalName: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return pattern.replace("{name}", originalName).replace("{date}", date);
}

function resolveOutputDir(file: { path: string }, config: any): string {
  const dir = path.dirname(file.path);
  if (config.outputMode === "subfolder") {
    return path.join(dir, config.outputSubfolder || "optimized");
  }
  return dir;
}

async function resolveOutputPath(
  file: { path: string; name: string },
  config: any,
): Promise<string> {
  const dir = path.dirname(file.path);
  const baseName = path.parse(file.name).name;
  const renamed = applyRenamePattern(
    config.renamePattern || "{name}",
    baseName,
  );
  const ext = config.format;

  if (config.outputMode === "subfolder") {
    const outDir = path.join(dir, config.outputSubfolder || "optimized");
    await fs.mkdir(outDir, { recursive: true });
    return path.join(outDir, `${renamed}.${ext}`);
  }

  if (config.outputMode === "suffix") {
    return path.join(dir, `${renamed}${config.outputSuffix || "_opt"}.${ext}`);
  }

  // replace — overwrite original (same path, new extension)
  return path.join(dir, `${renamed}.${ext}`);
}

async function processImage(
  file: { path: string; name: string },
  config: {
    quality: number;
    format: "jpeg" | "webp" | "png" | "avif";
    resize: boolean;
    width?: number;
    height?: number;
    outputMode: "subfolder" | "suffix" | "replace";
    outputSuffix: string;
    outputSubfolder: string;
    renamePattern: string;
    stripMetadata: boolean;
  },
  window: BrowserWindow,
  index: number,
  total: number,
) {
  if (cancellationRequested) return;

  const originalSize = (await fs.stat(file.path)).size;
  const outputPath = await resolveOutputPath(file, config);

  let image = sharp(file.path);

  if (config.stripMetadata) {
    image = image.withMetadata({});
  } else {
    image = image.withMetadata();
  }

  if (config.resize && config.width && config.height) {
    image = image.resize(config.width, config.height, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (config.format === "jpeg") {
    image = image.jpeg({
      quality: config.quality,
      progressive: true,
      mozjpeg: true,
    });
  } else if (config.format === "webp") {
    image = image.webp({ quality: config.quality });
  } else if (config.format === "avif") {
    image = image.avif({ quality: config.quality });
  } else if (config.format === "png") {
    image = image.png({
      compressionLevel: Math.floor((config.quality / 100) * 9),
      palette: true,
    });
  }

  await image.toFile(outputPath);
  const outputSize = (await fs.stat(outputPath)).size;

  window.webContents.send("progress", {
    current: index + 1,
    total,
    fileName: file.name,
    originalSize,
    outputSize,
  });
}
