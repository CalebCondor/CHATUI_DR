"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/lib/store";
import { Plus, Trash2, Settings } from "lucide-react";
import { toast } from "sonner";

export default function Sidebar() {
  const { clearMessages } = useChatStore();

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full md:w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col"
    >
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-slate-200 dark:border-slate-800">
        <Button
          onClick={() => {
            clearMessages();
            toast.success("Conversación nueva iniciada");
          }}
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white gap-2 text-sm md:text-base"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva conversación</span>
        </Button>
      </div>

      {/* History Placeholder */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">
          Historial
        </div>
        <div className="text-xs md:text-sm text-slate-600 dark:text-slate-400 py-8 text-center">
          No hay conversaciones previas
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 md:p-4 space-y-2">
        <Button
          variant="outline"
          className="w-full rounded-lg gap-2 border-slate-200 dark:border-slate-700 bg-transparent text-sm md:text-base"
          onClick={() => toast.info("Configuración disponible próximamente")}
        >
          <Settings className="h-4 w-4" />
          <span>Configuración</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full rounded-lg gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 text-sm md:text-base"
          onClick={() => {
            clearMessages();
            toast.success("Conversación limpiada");
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span>Limpiar todo</span>
        </Button>
      </div>
    </motion.div>
  );
}
