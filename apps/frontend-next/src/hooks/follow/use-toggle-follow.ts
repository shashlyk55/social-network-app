import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FollowService } from "@/services/follow.service";
import { toast } from "sonner";
import { OtherProfile, ProfilePreview } from "@/types/profile";

export const useToggleFollow = (
  profileId: number,
  isCurrentlyFollowed: boolean
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      isCurrentlyFollowed
        ? FollowService.unfollow(profileId)
        : FollowService.follow(profileId),

    // Оптимистичное обновление: меняем UI до того, как пришел ответ от сервера
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["profiles-search"] });
      await queryClient.cancelQueries({ queryKey: ["profile", profileId] });

      const previousSearchData = queryClient.getQueryData<ProfilePreview[]>([
        "profiles-search",
      ]);
      const previousProfileData = queryClient.getQueryData<OtherProfile>([
        "profile",
        profileId,
      ]);

      // 1. Обновляем список поиска (если он есть в кэше)
      if (previousSearchData) {
        queryClient.setQueryData<ProfilePreview[]>(["profiles-search"], (old) =>
          old?.map((p) =>
            p.id === profileId ? { ...p, isFollowed: !isCurrentlyFollowed } : p
          )
        );
      }

      if (previousProfileData) {
        queryClient.setQueryData(
          ["profile", profileId], // Убедитесь, что profileId здесь того же типа, что и в useProfileById
          (old: OtherProfile): OtherProfile => ({
            ...old,
            isFollowed: !isCurrentlyFollowed,
            // Если мы ПОДПИСЫВАЕМСЯ: принимаем сразу если публичный, иначе статус ожидания
            // Если мы ОТПИСЫВАЕМСЯ: всегда false
            isFollowAccepted: !isCurrentlyFollowed ? old.isPublic : false,
            followersCount: isCurrentlyFollowed
              ? old.isFollowAccepted
                ? old.followersCount - 1
                : old.followersCount
              : old.isPublic
                ? old.followersCount + 1
                : old.followersCount,
          })
        );
      }

      // 4. Возвращаем контекст для отката при ошибке
      return { previousSearchData, previousProfileData };
    },

    onSuccess: () => {
      // Инвалидируем поисковый запрос и данные профиля, чтобы синхронизировать всё
      queryClient.invalidateQueries({ queryKey: ["profiles-search"] });
      queryClient.invalidateQueries({ queryKey: ["profile", profileId] });

      const message = isCurrentlyFollowed ? "Вы подписались" : "Вы отписались";
      toast.success(message);
    },

    onError: (err, variables, context) => {
      // Откат к старым данным при ошибке
      if (context?.previousSearchData) {
        queryClient.setQueryData(
          ["profiles-search"],
          context.previousSearchData
        );
      }
      if (context?.previousProfileData) {
        queryClient.setQueryData(
          ["profile", profileId],
          context.previousProfileData
        );
      }
      toast.error("Не удалось изменить статус подписки");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["profiles-search"],
        refetchType: "none",
      });
      queryClient.invalidateQueries({
        queryKey: ["profile", profileId],
        refetchType: "none",
      });
    },
  });
};
