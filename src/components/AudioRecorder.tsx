"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface AudioRecorderProps {
  onAudioRecorded: (blob: Blob, fileName: string, url: string) => void;
  isLoading?: boolean;
}

export default function AudioRecorder({
  onAudioRecorded,
  isLoading,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const fileName = `audio-${Date.now()}.webm`;

        onAudioRecorded(blob, fileName, url);

        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Grabación iniciada");
    } catch {
      toast.error("No se pudo acceder al micrófono");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Audio grabado");
    }
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
