"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store";
import { sendMessage } from "@/lib/api";
import { Send, Loader2 } from "lucide-react";
import AudioRecorder from "./AudioRecorder";
import FileUploader from "./FileUploader";

type AIResponse =
  | string
  | {
      isAudio: true;
      base64: string;
      mimeType: string;
    }
  | null
  | undefined;

export default function ChatInput() {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isLoading, addMessage, setLoading, setError } = useChatStore();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleAudioRecorded = async (
    blob: Blob,
    fileName: string,
    url: string
  ) => {
    addMessage({
      id: Date.now().toString(),
      sender: "user",
      timestamp: new Date(),
      type: "audio",
      audioUrl: url,
      fileName,
    });

    const form = new FormData();
    form.append("file", blob, fileName);

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_OLLAMA_URL}/ollama/chat`,
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();
      const raw = data?.response?.content;

      handleAIResponse(raw);
    } catch {
      addMessage({
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "Error procesando audio.",
        type: "text",
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelected = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileUrl = e.target?.result as string;

      addMessage({
        id: Date.now().toString(),
        sender: "user",
        timestamp: new Date(),
        type: "file",
        fileUrl,
        fileName: file.name,
        fileMimeType: file.type,
      });

      sendFileMessage(file.name);
    };

    reader.readAsDataURL(file);
  };

  const sendFileMessage = async (fileName: string) => {
    setLoading(true);
    try {
      addMessage({
        id: (Date.now() + 1).toString(),
        text: `He recibido tu archivo: ${fileName}`,
        type: "text",
        sender: "assistant",
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");

    addMessage({
      id: Date.now().toString(),
      text: userMessage,
      type: "text",
      sender: "user",
      timestamp: new Date(),
    });

    setLoading(true);

    try {
      const raw = await sendMessage(userMessage);
      handleAIResponse(raw);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Error desconocido";

      setError(errMsg);

      addMessage({
        id: (Date.now() + 1).toString(),
        text: `Error: ${errMsg}.`,
        type: "text",
        sender: "assistant",
        timestamp: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAIResponse = (raw: AIResponse) => {
    if (!raw) {
      addMessage({
        id: Date.now().toString(),
        sender: "assistant",
        text: "[sin respuesta]",
        type: "text",
        timestamp: new Date(),
      });
      return;
    }

    if (typeof raw === "object" && raw.isAudio) {
      const audioUrl = `data:${raw.mimeType};base64,${raw.base64}`;

      addMessage({
        id: Date.now().toString(),
        sender: "assistant",
        type: "audio",
        audioUrl,
        fileName: "respuesta-ia.mp3",
        timestamp: new Date(),
      });

      return;
    }

    if (typeof raw === "string") {
      addMessage({
        id: Date.now().toString(),
        sender: "assistant",
        text: raw,
        type: "text",
        timestamp: new Date(),
      });
      return;
    }

    addMessage({
      id: Date.now().toString(),
      sender: "assistant",
      text: "[respuesta no reconocida]",
      type: "text",
      timestamp: new Date(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey && !isComposing) {
      const formEvent = new Event("submit", {
        bubbles: true,
        cancelable: true,
      });
      e.currentTarget.form?.dispatchEvent(formEvent);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 md:p-4"
    >
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto w-full">
        <div className="flex gap-2 md:gap-3 items-end">
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 md:px-4 py-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder="Tu mensaje... (Ctrl+Enter)"
              className="w-full bg-transparent resize-none outline-none text-sm md:text-base"
              rows={1}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 md:gap-3">
            <AudioRecorder
              onAudioRecorded={handleAudioRecorded}
              isLoading={isLoading}
            />

            <FileUploader
              onFileSelected={handleFileSelected}
              isLoading={isLoading}
            />

            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="rounded-full bg-linear-to-r from-blue-500 to-blue-600"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
