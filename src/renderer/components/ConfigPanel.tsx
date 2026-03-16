import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { OptimizerConfig } from '../types'

interface ConfigPanelProps {
  fileCount: number
  config: OptimizerConfig
  onConfigChange: (config: OptimizerConfig) => void
  onSubmit: () => void
  onBack: () => void
  error: string
}

export function ConfigPanel({
  fileCount,
  config,
  onConfigChange,
  onSubmit,
  onBack,
  error,
}: ConfigPanelProps) {
  const handleFormatChange = (format: 'jpeg' | 'webp' | 'png') => {
    onConfigChange({ ...config, format })
  }

  const handleQualityChange = (value: number[]) => {
    onConfigChange({ ...config, quality: value[0] })
  }

  const handleResizeToggle = () => {
    onConfigChange({ ...config, resize: !config.resize })
  }

  const handleWidthChange = (value: string) => {
    const width = value ? parseInt(value, 10) : undefined
    onConfigChange({ ...config, width: width || 1920 })
  }

  const handleHeightChange = (value: string) => {
    const height = value ? parseInt(value, 10) : undefined
    onConfigChange({ ...config, height: height || 1080 })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-primary/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Optimization Settings</h1>
            <p className="text-sm text-foreground/50 mt-1">Configure how to optimize your images</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle>Files to Optimize</CardTitle>
            <CardDescription>
              {fileCount} image{fileCount !== 1 ? 's' : ''} selected ready for processing
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Output Format</CardTitle>
            <CardDescription>Choose your preferred image format and quality settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <Label htmlFor="format" className="text-base mb-3 block">
                Format
              </Label>
              <Select value={config.format} onValueChange={handleFormatChange}>
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webp">WebP (Best compression)</SelectItem>
                  <SelectItem value="jpeg">JPEG (Wide compatibility)</SelectItem>
                  <SelectItem value="png">PNG (Lossless)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quality" className="text-base mb-3 block">
                Quality: {config.quality}%
              </Label>
              <Slider
                id="quality"
                min={10}
                max={100}
                step={5}
                value={[config.quality]}
                onValueChange={handleQualityChange}
                className="w-full"
              />
              <p className="text-sm text-slate-500 mt-2">
                {config.quality >= 85
                  ? 'High quality, larger file size'
                  : config.quality >= 70
                    ? 'Good balance'
                    : 'Small file size, reduced quality'}
              </p>
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Checkbox
                  id="resize"
                  checked={config.resize}
                  onCheckedChange={handleResizeToggle}
                />
                <Label htmlFor="resize" className="text-base cursor-pointer">
                  Resize Images
                </Label>
              </div>

              {config.resize && (
                <div className="space-y-4 ml-6">
                  <div>
                    <Label htmlFor="width" className="text-sm">
                      Width (px)
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      min="1"
                      value={config.width || ''}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="height" className="text-sm">
                      Height (px)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      min="1"
                      value={config.height || ''}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <p className="text-xs text-slate-500">
                    Images will be resized to fit within these dimensions without enlargement
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-10">
          <Button variant="outline" onClick={onBack} className="flex-1 h-11">
            Back
          </Button>
          <Button onClick={onSubmit} className="flex-1 h-11">
            Start Optimization
          </Button>
        </div>
      </div>
    </div>
  )
}
