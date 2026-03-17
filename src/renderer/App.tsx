import { useState, useEffect } from "react";
import { DropZone } from "./components/DropZone";
import { ConfigPanel } from "./components/ConfigPanel";
import { ProgressView } from "./components/ProgressView";
import { ThemeToggle } from "./components/ThemeToggle";
import { ImageFile, OptimizerConfig, ProgressUpdate, Screen } from "./types";

export default function App() {
  const [screen, setScreen] = useState<Screen>("dropzone");
  const [isDark, setIsDark] = useState(false);
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [config, setConfig] = useState<OptimizerConfig>({
    quality: 80,
    format: "webp",
    resize: false,
    width: 1920,
    height: 1080,
    outputMode: "subfolder",
    outputSuffix: "_opt",
    outputSubfolder: "optimized",
    renamePattern: "{name}",
    stripMetadata: true,
  });
  const [progress, setProgress] = useState<ProgressUpdate>({
    current: 0,
    total: 0,
    fileName: "",
  });
  const [error, setError] = useState<string>("");
  const [outputDir, setOutputDir] = useState<string>("");

  // apply dark class to html element
  useEffect(() => {
    const saved = localStorage.getItem("squish-theme");
    if (saved === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("squish-theme", next ? "dark" : "light");
  };

  useEffect(() => {
    window.api.onProgress((data) => setProgress(data));
    window.api.onComplete((data) => setOutputDir(data.outputDir));
    window.api.onError((errorMsg) => setError(errorMsg));
  }, []);

  const handleFilesSelected = (selectedFiles: ImageFile[]) => {
    setFiles(selectedFiles);
    setScreen("config");
  };

  const handleConfigSubmit = async () => {
    try {
      setError("");
      setProgress({ current: 0, total: files.length, fileName: "" });
      setScreen("progress");
      await window.api.optimizeImages(files, config);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setScreen("config");
    }
  };

  const handleCancel = async () => {
    await window.api.cancelOptimization();
    setScreen("dropzone");
    setFiles([]);
    setProgress({ current: 0, total: 0, fileName: "" });
  };

  const handleReset = () => {
    setScreen("dropzone");
    setFiles([]);
    setProgress({ current: 0, total: 0, fileName: "" });
    setOutputDir("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      {screen === "dropzone" && (
        <DropZone onFilesSelected={handleFilesSelected} />
      )}
      {screen === "config" && (
        <ConfigPanel
          fileCount={files.length}
          config={config}
          onConfigChange={setConfig}
          onSubmit={handleConfigSubmit}
          onBack={() => setScreen("dropzone")}
          error={error}
        />
      )}
      {screen === "progress" && (
        <ProgressView
          progress={progress}
          onCancel={handleCancel}
          onReset={handleReset}
          outputDir={outputDir}
        />
      )}
    </div>
  );
}
