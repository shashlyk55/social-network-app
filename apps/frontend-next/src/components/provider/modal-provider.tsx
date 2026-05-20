//"use client";

import { useMe } from "@/hooks/profile/use-me";
import { PostModal } from "../post/post-modal";
import { EditProfileModal } from "../profile/edit-profile-modal";
import { CreateChatModal } from "../chat/create-chat-modal";
import { AddMembersModal } from "../chat/add-members-modal";

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

  return (
    <>
      {profile && <EditProfileModal profile={profile} />}
      <PostModal />
    </>
  );
};
