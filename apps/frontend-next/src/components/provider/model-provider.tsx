// components/providers/modal-provider.tsx
"use client";

import dynamic from "next/dynamic";
import { useMe } from "@/hooks/profile/use-me";

// Загружаем модалки динамически с отключенным SSR
const EditProfileModal = dynamic(
  () =>
    import("@/components/profile/edit-profile-modal").then(
      (mod) => mod.EditProfileModal
    ),
  { ssr: false }
);

const CreatePostModal = dynamic(
  () =>
    import("@/components/post/create-post-modal").then(
      (mod) => mod.CreatePostModal
    ),
  { ssr: false }
);

export const ModalProvider = () => {
  const { data: profile } = useMe();

  // Теперь здесь нет useEffect и setIsMounted, следовательно, нет каскадного рендера
  return (
    <>
      {profile && <EditProfileModal profile={profile} />}
      <CreatePostModal />
    </>
  );
};
