export interface ImageFile {
  path: string
  name: string
}

export interface OptimizerConfig {
  quality: number
  format: 'jpeg' | 'webp' | 'png'
  resize: boolean
  width?: number
  height?: number
}

export interface ProgressUpdate {
  current: number
  total: number
  fileName: string
}

export type Screen = 'dropzone' | 'config' | 'progress'

declare global {
  interface Window {
    api: {
      optimizeImages: (files: ImageFile[], config: OptimizerConfig) => Promise<{ success: boolean; outputDir: string }>
      onProgress: (callback: (data: ProgressUpdate) => void) => void
      onComplete: (callback: (data: { outputDir: string }) => void) => void
      onError: (callback: (error: string) => void) => void
      cancelOptimization: () => Promise<void>
      openOutputFolder: (path: string) => Promise<{ success: boolean }>
    }
  }
}
