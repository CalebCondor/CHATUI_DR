"use client";

import { useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import Sidebar from "@/components/Sidebar";
import { useChatStore } from "@/lib/store";

export default function Home() {
  const { initializeStore } = useChatStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="hidden md:flex md:w-64">
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full md:w-auto">
        {/* Chat Window */}
        <ChatWindow />

        {/* Chat Input */}
        <ChatInput />
      </div>
    </div>
  );
}
