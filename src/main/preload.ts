import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  optimizeImages: (
    files: Array<{ path: string; name: string }>,
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
  ) => ipcRenderer.invoke("optimize-images", { files, config }),

  onProgress: (
    callback: (data: {
      current: number;
      total: number;
      fileName: string;
      originalSize?: number;
      outputSize?: number;
    }) => void,
  ) => {
    ipcRenderer.on("progress", (_, data) => callback(data));
  },

  onComplete: (callback: (data: { outputDir: string }) => void) => {
    ipcRenderer.on("complete", (_, data) => callback(data));
  },

  onError: (callback: (error: string) => void) => {
    ipcRenderer.on("error", (_, error) => callback(error));
  },

  cancelOptimization: () => ipcRenderer.invoke("cancel-optimization"),
  openOutputFolder: (path: string) => ipcRenderer.invoke("open-folder", path),
  selectFolder: () => ipcRenderer.invoke("select-folder"),
});
