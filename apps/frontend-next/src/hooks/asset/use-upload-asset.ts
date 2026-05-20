import { AssetService } from "@/services/asset.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadAsset = () => {
  return useMutation({
    mutationFn: (file: File) => AssetService.upload(file),

    onSuccess: () => {
      toast.success("Изображение загружено", { id: "upload-file" });
    },
    onError: () => {
      toast.error("Ошибка при загрузке файла", { id: "upload-file" });
    },
  });
};
