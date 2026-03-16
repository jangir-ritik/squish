import { ipcMain, BrowserWindow } from 'electron'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import pLimit from 'p-limit'
import { shell } from 'electron'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let cancellationRequested = false

export function setupIpcHandlers() {
  ipcMain.handle('optimize-images', async (event, { files, config }) => {
    try {
      cancellationRequested = false
      const window = BrowserWindow.fromWebContents(event.sender)
      if (!window) throw new Error('Window not found')

      const outputDir = path.join(
        path.dirname(files[0].path),
        'optimized_' + Date.now()
      )
      await fs.mkdir(outputDir, { recursive: true })

      const limit = pLimit(4)
      const tasks = files.map((file, index) =>
        limit(() => processImage(file, config, outputDir, window, index, files.length))
      )

      await Promise.all(tasks)

      if (!cancellationRequested) {
        window.webContents.send('complete', { outputDir })
      }

      return { success: true, outputDir }
    } catch (error) {
      const window = BrowserWindow.fromWebContents(event.sender)
      if (window) {
        window.webContents.send('error', error instanceof Error ? error.message : 'Unknown error')
      }
      throw error
    }
  })

  ipcMain.handle('cancel-optimization', () => {
    cancellationRequested = true
  })

  ipcMain.handle('open-folder', async (_, folderPath) => {
    try {
      shell.openPath(folderPath)
      return { success: true }
    } catch (error) {
      throw error
    }
  })
}

async function processImage(
  file: { path: string; name: string },
  config: {
    quality: number
    format: 'jpeg' | 'webp' | 'png'
    resize: boolean
    width?: number
    height?: number
  },
  outputDir: string,
  window: BrowserWindow,
  index: number,
  total: number
) {
  if (cancellationRequested) return

  const baseName = path.parse(file.name).name
  const outputFileName = `${baseName}.${config.format}`
  const outputPath = path.join(outputDir, outputFileName)

  let image = sharp(file.path)

  if (config.resize && config.width && config.height) {
    image = image.resize(config.width, config.height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  if (config.format === 'jpeg') {
    image = image.jpeg({ quality: config.quality, progressive: true })
  } else if (config.format === 'webp') {
    image = image.webp({ quality: config.quality })
  } else if (config.format === 'png') {
    image = image.png({ compressionLevel: Math.floor((config.quality / 100) * 9) })
  }

  await image.toFile(outputPath)

  window.webContents.send('progress', {
    current: index + 1,
    total,
    fileName: file.name,
  })
}
