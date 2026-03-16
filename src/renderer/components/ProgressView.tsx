import { useState } from 'react'
import { CheckCircle2, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ProgressUpdate } from '../types'

interface ProgressViewProps {
  progress: ProgressUpdate
  onCancel: () => void
  onReset: () => void
  outputDir: string
}

export function ProgressView({ progress, onCancel, onReset, outputDir }: ProgressViewProps) {
  const [isOpening, setIsOpening] = useState(false)

  const isComplete = progress.current === progress.total && progress.total > 0
  const percentComplete = progress.total > 0 ? (progress.current / progress.total) * 100 : 0

  const handleOpenFolder = async () => {
    if (outputDir) {
      setIsOpening(true)
      try {
        await window.api.openOutputFolder(outputDir)
      } catch (error) {
        console.error('Failed to open folder:', error)
      } finally {
        setIsOpening(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            {isComplete ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-accent/10 rounded-full">
                    <CheckCircle2 className="w-10 h-10 text-accent" />
                  </div>
                </div>
                <CardTitle className="text-3xl text-foreground">Optimization Complete!</CardTitle>
                <CardDescription className="text-base mt-2">
                  All {progress.total} images have been successfully optimized
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-3xl text-foreground">Optimizing Images</CardTitle>
                <CardDescription className="text-base mt-2">
                  Processing {progress.current} of {progress.total} images
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-foreground">Progress</span>
                <span className="text-sm font-semibold text-foreground">{Math.round(percentComplete)}%</span>
              </div>
              <Progress value={percentComplete} className="h-3 bg-secondary" />
            </div>

            {progress.fileName && !isComplete && (
              <div className="bg-card border border-border rounded-xl p-5">
                <p className="text-sm text-foreground/70">
                  <span className="font-semibold text-foreground">Currently processing:</span>
                </p>
                <p className="text-sm text-foreground font-medium mt-2 truncate">{progress.fileName}</p>
              </div>
            )}

            {isComplete && outputDir && (
              <div className="bg-accent/5 border border-accent/20 rounded-xl p-5">
                <p className="text-sm text-foreground/70 mb-3">
                  <span className="font-semibold text-foreground">Output folder:</span>
                </p>
                <p className="text-xs text-foreground/50 break-all font-mono mb-4 bg-background/50 rounded p-3">{outputDir}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenFolder}
                  disabled={isOpening}
                  className="gap-2 h-10"
                >
                  <Folder className="w-4 h-4" />
                  {isOpening ? 'Opening...' : 'Open Folder'}
                </Button>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {!isComplete ? (
                <Button variant="destructive" onClick={onCancel} className="w-full h-11">
                  Cancel
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={onReset} className="flex-1 h-11">
                    Optimize More Images
                  </Button>
                  <Button onClick={onReset} className="flex-1 h-11">
                    Done
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
