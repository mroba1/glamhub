"use client";
import { useState, useCallback, useRef } from "react";
import { MAX_FILE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/constants";

interface UseUploadOptions {
  maxFiles?: number;
  maxSize?: number;
  accept?: string[];
  onSuccess?: (files: File[], previews: string[]) => void;
  onError?: (error: string) => void;
}

interface UploadState {
  files: File[];
  previews: string[];
  isDragging: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
}

export function useUpload(options: UseUploadOptions = {}) {
  const {
    maxFiles = 1,
    maxSize = MAX_FILE_SIZE,
    accept = ACCEPTED_IMAGE_TYPES,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<UploadState>({
    files: [],
    previews: [],
    isDragging: false,
    isUploading: false,
    uploadProgress: 0,
    error: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!accept.includes(file.type)) {
      return `Invalid file type. Accepted: ${accept.map((t) => t.split("/")[1]).join(", ")}`;
    }
    if (file.size > maxSize) {
      return `File too large. Max size: ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    return null;
  };

  const processFiles = useCallback(
    (newFiles: File[]) => {
      const limited = newFiles.slice(0, maxFiles);
      const errors: string[] = [];
      const valid: File[] = [];

      for (const file of limited) {
        const err = validateFile(file);
        if (err) errors.push(err);
        else valid.push(file);
      }

      if (errors.length > 0) {
        const errMsg = errors[0];
        setState((s) => ({ ...s, error: errMsg }));
        onError?.(errMsg);
        return;
      }

      const previews = valid.map((f) => URL.createObjectURL(f));
      setState((s) => ({ ...s, files: valid, previews, error: null }));
      onSuccess?.(valid, previews);
    },
    [maxFiles, accept, maxSize, onSuccess, onError]
  );

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, isDragging: true }));
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState((s) => ({ ...s, isDragging: false }));
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState((s) => ({ ...s, isDragging: false }));
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [processFiles]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      processFiles(files);
    },
    [processFiles]
  );

  const openFilePicker = () => inputRef.current?.click();

  const removeFile = (index: number) => {
    setState((s) => {
      URL.revokeObjectURL(s.previews[index]);
      const files = s.files.filter((_, i) => i !== index);
      const previews = s.previews.filter((_, i) => i !== index);
      return { ...s, files, previews };
    });
  };

  const clearAll = () => {
    state.previews.forEach((p) => URL.revokeObjectURL(p));
    setState({ files: [], previews: [], isDragging: false, isUploading: false, uploadProgress: 0, error: null });
  };

  const simulateProgress = async (
    uploadFn: () => Promise<void>
  ): Promise<void> => {
    setState((s) => ({ ...s, isUploading: true, uploadProgress: 0 }));
    const interval = setInterval(() => {
      setState((s) => ({
        ...s,
        uploadProgress: Math.min(s.uploadProgress + 10, 90),
      }));
    }, 200);
    try {
      await uploadFn();
      clearInterval(interval);
      setState((s) => ({ ...s, uploadProgress: 100 }));
      setTimeout(() => setState((s) => ({ ...s, isUploading: false })), 500);
    } catch {
      clearInterval(interval);
      setState((s) => ({ ...s, isUploading: false, error: "Upload failed. Please try again." }));
    }
  };

  return {
    ...state,
    inputRef,
    onDragEnter,
    onDragLeave,
    onDrop,
    onFileChange,
    openFilePicker,
    removeFile,
    clearAll,
    simulateProgress,
  };
}
