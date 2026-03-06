"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

// Web Speech API type definitions
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

// Browser compatibility
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface AudioRecorderProps {
  onAudioRecorded: (
    blob: Blob,
    fileName: string,
    url: string,
    transcript: string
  ) => void;
  isLoading?: boolean;
}

export default function AudioRecorder({
  onAudioRecorded,
  isLoading,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const transcriptRef = useRef<string>("");

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // ── MediaRecorder (saves the audio blob) ──────────────────────────────
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      transcriptRef.current = "";

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const fileName = `audio-${Date.now()}.webm`;

        console.log("[AudioRecorder] Recording stopped. Transcript:", transcriptRef.current);
        onAudioRecorded(blob, fileName, url, transcriptRef.current);
        stream.getTracks().forEach((t) => t.stop());
      };

      // ── Web Speech API (real-time transcription) ──────────────────────────
      const SpeechRecognitionAPI =
        window.SpeechRecognition ?? window.webkitSpeechRecognition;

      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognition.lang = "es-ES";
        recognition.continuous = true;
        recognition.interimResults = false;

        console.log("[SpeechRecognition] Starting with lang:", recognition.lang);

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              transcript += result[0].transcript.trim() + " ";
            }
          }
          if (transcript) {
            console.log("[SpeechRecognition] Detected:", transcript.trim());
            transcriptRef.current += (transcriptRef.current ? " " : "") + transcript.trim();
          }
        };

        recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
          // Only warn for real errors (not 'no-speech' which is harmless)
          if (e.error !== "no-speech") {
            console.warn("[SpeechRecognition] Error:", e.error);
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } else {
        toast.warning("Tu navegador no soporta transcripción de voz automática");
      }

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Grabación iniciada");
    } catch {
      toast.error("No se pudo acceder al micrófono");
    }
  };

  const stopRecording = () => {
    // Stop speech recognition and wait for final results before stopping MediaRecorder
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    // Wait 500ms for recognition to process final results before stopping the audio
    setTimeout(() => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        toast.success("Audio grabado");
      }
    }, 500);
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex items-center gap-2"
    >
      <Button
        type="button"
        size="icon"
        disabled={isLoading}
        onClick={isRecording ? stopRecording : startRecording}
        className={`rounded-full h-10 w-10 ${
          isRecording ? "bg-red-500" : "bg-purple-600"
        }`}
      >
        {isRecording ? <Square /> : <Mic />}
      </Button>
    </motion.div>
  );
}
