"use client";

import { useModalStore } from "@/store/use-modal-store";
import { CreatePostForm } from "@/components/post/create-post-form";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CreatePostModal = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "createPost";

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-[#0f0f0f] border border-[#222] rounded-[32px] overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-[#1a1a1a]">
              <h2 className="text-xl font-bold">Новая публикация</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#1a1a1a] rounded-full text-slate-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-2">
              <CreatePostForm onSuccess={onClose} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
