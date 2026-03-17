import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { OptimizerConfig } from "../types";

interface ConfigPanelProps {
  fileCount: number;
  config: OptimizerConfig;
  onConfigChange: (config: OptimizerConfig) => void;
  onSubmit: () => void;
  onBack: () => void;
  error: string;
}

export function ConfigPanel({
  fileCount,
  config,
  onConfigChange,
  onSubmit,
  onBack,
  error,
}: ConfigPanelProps) {
  const set = (patch: Partial<OptimizerConfig>) =>
    onConfigChange({ ...config, ...patch });

  const qualityLabel =
    config.quality >= 85
      ? "High quality, larger file size"
      : config.quality >= 70
        ? "Good balance of quality and size"
        : "Smaller file size, some quality loss";

  const showQuality = config.format !== "png";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Optimization Settings
            </h1>
            <p className="text-sm text-foreground/50 mt-1">
              {fileCount} image{fileCount !== 1 ? "s" : ""} ready to process
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Format + Quality */}
        <Card className="mb-4 border-border/50">
          <CardHeader>
            <CardTitle>Format & Quality</CardTitle>
            <CardDescription>
              Output format and compression level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base mb-3 block">Format</Label>
              <Select
                value={config.format}
                onValueChange={(v) =>
                  set({ format: v as OptimizerConfig["format"] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="webp">WebP — best compression</SelectItem>
                  <SelectItem value="avif">
                    AVIF — even smaller, slower
                  </SelectItem>
                  <SelectItem value="jpeg">
                    JPEG — wide compatibility
                  </SelectItem>
                  <SelectItem value="png">PNG — lossless</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showQuality && (
              <div>
                <Label className="text-base mb-3 block">
                  Quality: {config.quality}%
                </Label>
                <Slider
                  min={10}
                  max={100}
                  step={5}
                  value={[config.quality]}
                  onValueChange={([v]) => set({ quality: v })}
                />
                <p className="text-sm text-foreground/50 mt-2">
                  {qualityLabel}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Checkbox
                id="stripMetadata"
                checked={config.stripMetadata}
                onCheckedChange={(v) => set({ stripMetadata: !!v })}
              />
              <Label htmlFor="stripMetadata" className="cursor-pointer">
                Strip metadata{" "}
                <span className="text-foreground/40 text-sm">
                  (EXIF, GPS, ICC)
                </span>
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Output options */}
        <Card className="mb-4 border-border/50">
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>
              Where to save the compressed files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={config.outputMode}
              onValueChange={(v) =>
                set({ outputMode: v as OptimizerConfig["outputMode"] })
              }
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="subfolder" id="subfolder" />
                <Label htmlFor="subfolder" className="cursor-pointer">
                  Save to subfolder
                </Label>
              </div>
              {config.outputMode === "subfolder" && (
                <Input
                  className="ml-6 w-48"
                  value={config.outputSubfolder}
                  onChange={(e) => set({ outputSubfolder: e.target.value })}
                  placeholder="optimized"
                />
              )}

              <div className="flex items-center gap-3">
                <RadioGroupItem value="suffix" id="suffix" />
                <Label htmlFor="suffix" className="cursor-pointer">
                  Add suffix to filename
                </Label>
              </div>
              {config.outputMode === "suffix" && (
                <Input
                  className="ml-6 w-48"
                  value={config.outputSuffix}
                  onChange={(e) => set({ outputSuffix: e.target.value })}
                  placeholder="_opt"
                />
              )}

              <div className="flex items-center gap-3">
                <RadioGroupItem value="replace" id="replace" />
                <Label
                  htmlFor="replace"
                  className="cursor-pointer text-destructive"
                >
                  Replace original{" "}
                  <span className="text-foreground/40 text-sm font-normal">
                    (cannot be undone)
                  </span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Rename pattern */}
        <Card className="mb-4 border-border/50">
          <CardHeader>
            <CardTitle>Rename Pattern</CardTitle>
            <CardDescription>
              Use{" "}
              <code className="bg-muted px-1 rounded text-xs">{"{name}"}</code>{" "}
              for original filename,{" "}
              <code className="bg-muted px-1 rounded text-xs">{"{date}"}</code>{" "}
              for today's date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={config.renamePattern}
              onChange={(e) => set({ renamePattern: e.target.value })}
              placeholder="{name}"
            />
            <p className="text-xs text-foreground/40 mt-2">
              Preview:{" "}
              {config.renamePattern
                .replace("{name}", "photo")
                .replace("{date}", new Date().toISOString().slice(0, 10))}
              .{config.format}
            </p>
          </CardContent>
        </Card>

        {/* Resize */}
        <Card className="mb-8 border-border/50">
          <CardHeader>
            <CardTitle>
              Resize{" "}
              <span className="text-foreground/40 text-sm font-normal">
                (optional)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="resize"
                checked={config.resize}
                onCheckedChange={(v) => set({ resize: !!v })}
              />
              <Label htmlFor="resize" className="cursor-pointer">
                Enable resize
              </Label>
            </div>
            {config.resize && (
              <div className="flex gap-4 ml-6">
                <div>
                  <Label className="text-sm">Width (px)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={config.width || ""}
                    onChange={(e) =>
                      set({ width: parseInt(e.target.value) || undefined })
                    }
                    className="mt-1 w-32"
                  />
                </div>
                <div>
                  <Label className="text-sm">Height (px)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={config.height || ""}
                    onChange={(e) =>
                      set({ height: parseInt(e.target.value) || undefined })
                    }
                    className="mt-1 w-32"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1 h-11">
            Back
          </Button>
          <Button onClick={onSubmit} className="flex-1 h-11">
            Squish {fileCount} image{fileCount !== 1 ? "s" : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}
