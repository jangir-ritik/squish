import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageFile } from '../types'

interface DropZoneProps {
  onFilesSelected: (files: ImageFile[]) => void
}

export function DropZone({ onFilesSelected }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files))
    }
  }

  const processFiles = (fileList: File[]) => {
    const imageFiles: ImageFile[] = fileList
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        name: file.name,
        path: file.path || '',
      }))

    if (imageFiles.length > 0) {
      onFilesSelected(imageFiles)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="w-full max-w-2xl px-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-200 ${
            isDragging
              ? 'border-primary bg-primary/10 scale-[1.02] shadow-lg'
              : 'border-border hover:border-primary hover:bg-card/50 hover:shadow-md'
          }`}
        >
          <div className="flex justify-center mb-8">
            <div className={`p-5 rounded-full transition-all duration-200 ${
              isDragging
                ? 'bg-primary/20 scale-110'
                : 'bg-primary/10'
            }`}>
              <Upload className={`w-10 h-10 transition-colors ${
                isDragging ? 'text-primary' : 'text-primary'
              }`} />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
            Batch Image Optimizer
          </h1>
          <p className="text-xl text-foreground/70 mb-10 leading-relaxed">
            Drag and drop your images here or click to browse
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          <Button
            onClick={() => fileInputRef.current?.click()}
            size="lg"
            className="mb-8 h-12 px-8 text-base"
          >
            Select Images
          </Button>

          <p className="text-sm text-foreground/50 mt-8">
            Supports JPG, PNG, WebP, TIFF, and more. Optimize multiple images in seconds.
          </p>
        </div>
      </div>
    </div>
  )
}
