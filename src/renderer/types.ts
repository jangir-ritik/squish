export interface ImageFile {
  path: string;
  name: string;
  size?: number;
}

export interface OptimizerConfig {
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
}

export interface ProgressUpdate {
  current: number;
  total: number;
  fileName: string;
  originalSize?: number;
  outputSize?: number;
}

export type Screen = "dropzone" | "config" | "progress";

declare global {
  interface Window {
    api: {
      optimizeImages: (
        files: ImageFile[],
        config: OptimizerConfig,
      ) => Promise<{ success: boolean; outputDir: string }>;
      onProgress: (callback: (data: ProgressUpdate) => void) => void;
      onComplete: (callback: (data: { outputDir: string }) => void) => void;
      onError: (callback: (error: string) => void) => void;
      cancelOptimization: () => Promise<void>;
      openOutputFolder: (path: string) => Promise<{ success: boolean }>;
      selectFolder: () => Promise<string | null>;
    };
  }
}
