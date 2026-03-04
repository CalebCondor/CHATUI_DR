"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Message } from "@/lib/store";
import AudioPlayer from "./AudioPlayer";

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

type AudioContent = {
  isAudio: true;
  base64: string;
  mimeType: string;
};

export default function ChatMessage({ message, isLoading }: ChatMessageProps) {
  /*const autoPlayRef = useRef<HTMLAudioElement>(null);*/

  function isAudioContent(content: unknown): content is AudioContent {
    if (
      content &&
      typeof content === "object" &&
      "isAudio" in content &&
      (content as Record<string, unknown>).isAudio === true
    ) {
      return true;
    }
    return false;
  }

  const isUser = message.sender === "user";

  // Normalizar texto
  const safeText = typeof message.text === "string" ? message.text.trim() : "";
  const hasRealText = safeText.length > 0;

  // ✅ Detectar audios (usuario o IA grabado)
  const isAIAudio = message.type === "audio" || isAudioContent(message.content);

  // ✅ Convertir base64 → URL reproducible
  let audioUrl = message.audioUrl ?? null;
  if (!audioUrl && isAIAudio && message.content?.base64) {
    audioUrl = `data:${message.content.mimeType};base64,${message.content.base64}`;
  }

  // ✅ TTS de ElevenLabs: reproducir automáticamente al llegar
  /*
  const ttsUrl = message.ttsAudioUrl ?? null;

  useEffect(() => {
    if (ttsUrl && autoPlayRef.current) {
      autoPlayRef.current.src = ttsUrl;
      autoPlayRef.current.play().catch(() => {
        // El navegador puede bloquear autoplay; el usuario verá el player manual
      });
    }
  }, [ttsUrl]);
  */
 {/* 
          <div className="space-y-2">
            <p className="whitespace-pre-wrap">{safeText}</p>
            {ttsUrl && !isUser && (
              <div className="pt-1 border-t border-slate-200 dark:border-slate-700">
                <audio ref={autoPlayRef} className="hidden" />
                <AudioPlayer audioUrl={ttsUrl} fileName="respuesta-voz.mp3" />
              </div>
            )}
          </div>    */}
  return (
    <motion.div
      layout
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      } gap-2 md:gap-3`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-lg">
          🤖
        </div>
      )}

      <div
        className={`max-w-xl px-4 py-3 rounded-2xl shadow-sm text-sm ${
          isUser
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white dark:bg-slate-800 rounded-bl-none"
        }`}
      >
        {isLoading ? (
          <div className="flex gap-1.5">...</div>
        ) : isAIAudio && audioUrl ? (
          // ✅ AUDIO DE IA O USUARIO (base64 O URL)
          <AudioPlayer
            audioUrl={audioUrl}
            fileName={message.fileName ?? "audio.mp3"}
          />
        ) : message.type === "file" && message.fileName ? (
          <div>
            <p className="font-medium">📎 Archivo enviado:</p>
            <a
              href={message.fileUrl}
              target="_blank"
              className={`underline ${
                isUser ? "text-white" : "text-blue-600"
              } break-all`}
            >
              {message.fileName}
            </a>
            {hasRealText && <p className="pt-2">{safeText}</p>}
          </div>
        ) : hasRealText ? (
          <p className="whitespace-pre-wrap">{safeText}</p>
         
        ) : (
          <p className="opacity-50 italic">[mensaje vacío]</p>
        )}
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg">
          👤
        </div>
      )}
    </motion.div>
  );
}

