"use client";

import type React from "react";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip } from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
  acceptedTypes?: string;
}

export default function FileUploader({
  onFileSelected,
  isLoading,
  acceptedTypes = "image/*,application/pdf,audio/*",
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error("El archivo es muy grande (máximo 50MB)");
        return;
      }
      onFileSelected(file);
    }
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileChange}
        accept={acceptedTypes}
        className="hidden"
      />
      <Button
        type="button"
        size="icon"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        className="rounded-full bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 h-10 w-10 md:h-11 md:w-11"
      >
        <Paperclip className="h-4 md:h-5 w-4 md:w-5" />
      </Button>
    </>
  );
}
