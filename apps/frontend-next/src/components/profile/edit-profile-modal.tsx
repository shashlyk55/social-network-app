"use client";

import { useModalStore } from "@/store/use-modal-store";
import { MyProfile } from "@/types/profile";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EditProfileForm } from "./edit-profile-form";

export function EditProfileModal({ profile }: { profile: MyProfile }) {
  const { isOpen, type, onClose } = useModalStore();
  const isModalOpen = isOpen && type === "editProfile";

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Редактировать профиль
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <EditProfileForm
              profile={profile}
              onSuccess={onClose}
              onCancel={onClose}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
