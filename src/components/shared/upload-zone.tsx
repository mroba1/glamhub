"use client";
import { Upload, X, RefreshCw, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/use-upload";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UploadZoneProps {
  label?: string;
  maxFiles?: number;
  hint?: string;
  onFilesSelected?: (files: File[]) => void;
  className?: string;
}

export function UploadZone({
  label = "Upload Image",
  maxFiles = 1,
  hint,
  onFilesSelected,
  className,
}: UploadZoneProps) {
  const {
    files,
    previews,
    isDragging,
    isUploading,
    uploadProgress,
    error,
    inputRef,
    onDragEnter,
    onDragLeave,
    onDrop,
    onFileChange,
    openFilePicker,
    removeFile,
    clearAll,
  } = useUpload({
    maxFiles,
    onSuccess: (f) => onFilesSelected?.(f),
  });

  return (
    <div className={cn("w-full space-y-3", className)}>
      {label && (
        <label className="text-sm font-medium text-[hsl(0,0%,80%)]">{label}</label>
      )}

      {previews.length === 0 ? (
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={openFilePicker}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 cursor-pointer transition-all duration-200",
            isDragging
              ? "border-[hsl(38,65%,60%)] bg-[hsl(38,65%,60%)/5%]"
              : "border-[hsl(0,0%,20%)] hover:border-[hsl(38,65%,60%)/50%] hover:bg-[hsl(0,0%,10%)]"
          )}
        >
          <div className="h-12 w-12 rounded-xl bg-[hsl(38,65%,60%)/10%] flex items-center justify-center">
            <Upload className="h-5 w-5 text-[hsl(38,65%,60%)]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[hsl(0,0%,80%)]">
              {isDragging ? "Drop to upload" : "Drag & drop or click to browse"}
            </p>
            <p className="text-xs text-[hsl(0,0%,50%)] mt-1">
              {hint ?? "JPEG, PNG, WebP up to 5MB"}
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple={maxFiles > 1}
            onChange={onFileChange}
            className="sr-only"
          />
        </div>
      ) : (
        <div className="space-y-2">
          <div className={cn(
            "grid gap-2",
            previews.length > 1 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"
          )}>
            {previews.map((preview, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-[hsl(0,0%,15%)]">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                    className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {maxFiles > 1 && previews.length < maxFiles && (
              <button
                onClick={openFilePicker}
                className="aspect-square rounded-lg border-2 border-dashed border-[hsl(0,0%,20%)] flex flex-col items-center justify-center gap-2 hover:border-[hsl(38,65%,60%)/50%] transition-colors"
              >
                <ImageIcon className="h-6 w-6 text-[hsl(0,0%,50%)]" />
                <span className="text-xs text-[hsl(0,0%,50%)]">Add more</span>
              </button>
            )}
          </div>

          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[hsl(0,0%,60%)]">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-[hsl(0,0%,15%)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[hsl(38,65%,60%)] rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
              <X className="h-3 w-3" />
              Clear
            </Button>
            <Button variant="ghost" size="sm" onClick={openFilePicker} className="text-xs">
              <RefreshCw className="h-3 w-3" />
              Replace
            </Button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple={maxFiles > 1}
            onChange={onFileChange}
            className="sr-only"
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <X className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
