import { useState, useRef } from "react";
import { Upload, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageFile } from "../types";

interface DropZoneProps {
  onFilesSelected: (files: ImageFile[]) => void;
}

const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "tiff",
  "tif",
  "gif",
  "bmp",
]);

function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  return IMAGE_EXTENSIONS.has(ext);
}

export function DropZone({ onFilesSelected }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // only trigger if leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const handleFolderInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
  };

  const processFiles = (fileList: File[]) => {
    const imageFiles: ImageFile[] = fileList
      .filter(isImageFile)
      .map((file) => ({
        name: file.name,
        path: (file as any).path || "",
        size: file.size,
      }));

    // deduplicate by path
    const seen = new Set<string>();
    const unique = imageFiles.filter((f) => {
      if (seen.has(f.path)) return false;
      seen.add(f.path);
      return true;
    });

    if (unique.length > 0) onFilesSelected(unique);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="w-full max-w-2xl px-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary/10 scale-[1.02] shadow-lg"
              : "border-border hover:border-primary hover:bg-card/50 hover:shadow-md"
          }`}
        >
          <div className="flex justify-center mb-8">
            <div
              className={`p-5 rounded-full transition-all duration-200 ${
                isDragging ? "bg-primary/20 scale-110" : "bg-primary/10"
              }`}
            >
              <Upload className="w-10 h-10 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-3 tracking-tight">
            Squish
          </h1>
          <p className="text-xl text-foreground/70 mb-10 leading-relaxed">
            Drop images or a folder here to get started
          </p>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <input
            ref={folderInputRef}
            type="file"
            {...({ webkitdirectory: "" } as any)}
            multiple
            onChange={handleFolderInput}
            className="hidden"
          />

          <div className="flex gap-3 justify-center mb-8">
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              className="h-12 px-8 text-base"
            >
              Select Images
            </Button>
            <Button
              onClick={() => folderInputRef.current?.click()}
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Select Folder
            </Button>
          </div>

          <p className="text-sm text-foreground/50">
            Supports JPG, PNG, WebP, AVIF, TIFF and more · Subfolders included
            automatically
          </p>
        </div>
      </div>
    </div>
  );
}
