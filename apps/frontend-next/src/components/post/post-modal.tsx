"use client";

import { useModalStore } from "@/store/use-modal-store";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CreatePostForm } from "./create-post-form";
import { EditPostForm } from "./edit-post-form";

export const PostModal = () => {
  const { isOpen, onClose, type, data } = useModalStore();

  // Проверяем, относится ли текущий тип к постам
  const isModalOpen = isOpen && (type === "createPost" || type === "editPost");
  const isEdit = type === "editPost";

  if (!isModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[#0f0f0f] border border-[#222] rounded-[32px] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-[#1a1a1a]">
            <h2 className="text-xl font-bold text-white">
              {isEdit ? "Редактировать публикацию" : "Новая публикация"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#1a1a1a] rounded-full text-slate-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {type === "createPost" && <CreatePostForm onSuccess={onClose} />}
            {type === "editPost" && data.post && (
              <EditPostForm post={data.post} onSuccess={onClose} />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
