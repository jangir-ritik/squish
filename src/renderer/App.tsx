import { useState, useEffect } from 'react'
import { DropZone } from './components/DropZone'
import { ConfigPanel } from './components/ConfigPanel'
import { ProgressView } from './components/ProgressView'
import { ImageFile, OptimizerConfig, ProgressUpdate, Screen } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('dropzone')
  const [files, setFiles] = useState<ImageFile[]>([])
  const [config, setConfig] = useState<OptimizerConfig>({
    quality: 80,
    format: 'webp',
    resize: false,
    width: 1920,
    height: 1080,
  })
  const [progress, setProgress] = useState<ProgressUpdate>({
    current: 0,
    total: 0,
    fileName: '',
  })
  const [error, setError] = useState<string>('')
  const [outputDir, setOutputDir] = useState<string>('')

  useEffect(() => {
    window.api.onProgress((data) => {
      setProgress(data)
    })

    window.api.onComplete((data) => {
      setOutputDir(data.outputDir)
    })

    window.api.onError((errorMsg) => {
      setError(errorMsg)
    })
  }, [])

  const handleFilesSelected = (selectedFiles: ImageFile[]) => {
    setFiles(selectedFiles)
    setScreen('config')
  }

  const handleConfigSubmit = async () => {
    try {
      setError('')
      setProgress({ current: 0, total: files.length, fileName: '' })
      setScreen('progress')
      await window.api.optimizeImages(files, config)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setScreen('config')
    }
  }

  const handleCancel = async () => {
    await window.api.cancelOptimization()
    setScreen('dropzone')
    setFiles([])
    setProgress({ current: 0, total: 0, fileName: '' })
  }

  const handleReset = () => {
    setScreen('dropzone')
    setFiles([])
    setProgress({ current: 0, total: 0, fileName: '' })
    setOutputDir('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-background">
      {screen === 'dropzone' && <DropZone onFilesSelected={handleFilesSelected} />}
      {screen === 'config' && (
        <ConfigPanel
          fileCount={files.length}
          config={config}
          onConfigChange={setConfig}
          onSubmit={handleConfigSubmit}
          onBack={() => setScreen('dropzone')}
          error={error}
        />
      )}
      {screen === 'progress' && (
        <ProgressView
          progress={progress}
          onCancel={handleCancel}
          onReset={handleReset}
          outputDir={outputDir}
        />
      )}
    </div>
  )
}
