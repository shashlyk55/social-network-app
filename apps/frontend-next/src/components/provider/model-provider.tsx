//"use client";

import dynamic from "next/dynamic";
import { useMe } from "@/hooks/profile/use-me";
import { PostModal } from "../post/post-modal";
import { EditProfileModal } from "../profile/edit-profile-modal";

// Загружаем модалки динамически с отключенным SSR
// const EditProfileModal = dynamic(
//   () =>
//     import("@/components/profile/edit-profile-modal").then(
//       (mod) => mod.EditProfileModal
//     ),
//   { ssr: false }
// );

export const ModalProvider = () => {
  const { data: profile } = useMe();

  // Теперь здесь нет useEffect и setIsMounted, следовательно, нет каскадного рендера
  return (
    <>
      {profile && <EditProfileModal profile={profile} />}
      <PostModal />
    </>
  );
};
