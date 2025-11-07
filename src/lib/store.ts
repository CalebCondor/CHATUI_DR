import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface Message {
  id: string;
  sender: "user" | "assistant";
  text?: string;
  type: "text" | "audio" | "file";
  timestamp: Date;

  // ✅ Usuario
  audioUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileMimeType?: string;

  // ✅ IA (para audios base64)
  content?: {
    isAudio: boolean;
    message: string;
    mimeType: string;
    base64: string;
  } | null;
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeStore: () => void;
}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set) => ({
        messages: [],
        isLoading: false,
        error: null,

        addMessage: (message: Message) =>
          set((state) => ({
            messages: [...state.messages, message],
          })),

        clearMessages: () =>
          set({
            messages: [],
            error: null,
          }),

        setLoading: (loading: boolean) =>
          set({
            isLoading: loading,
          }),

        setError: (error: string | null) =>
          set({
            error,
          }),

        initializeStore: () => {
          // Inicialización del store si es necesario
        },
      }),
      {
        name: "chat-storage", // localStorage key
      }
    ),
    { name: "ChatStore" }
  )
);
