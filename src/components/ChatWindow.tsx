"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "./ChatMessage";
import { useChatStore } from "@/lib/store";

export default function ChatWindow() {
  const { messages, isLoading } = useChatStore();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 space-y-3 md:space-y-4">
      <AnimatePresence mode="wait">
        {messages.length === 0 ? (
          // ✅ MENSAJE VACÍO
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center h-full"
          >
            <div className="text-center space-y-4 px-4">
              <div className="w-12 md:w-16 h-12 md:h-16 mx-auto bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl md:text-2xl">
                💬
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Bienvenido al Chatbot
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                  Comienza una conversación escribiendo un mensaje abajo
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          // ✅ LISTA DE MENSAJES
          <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto w-full">
            {messages.map((message, index) => (
              <motion.div
                key={`${message.id}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage message={message} />
              </motion.div>
            ))}

            {/* ✅ Loading message con type y sin texto inconsistente */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage
                  message={{
                    id: "loading",
                    text: "", // pero NO se mostrará "[mensaje vacío]"
                    sender: "assistant",
                    type: "text",
                    timestamp: new Date(),
                  }}
                  isLoading
                />
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      <div ref={endOfMessagesRef} />
    </div>
  );
}
