import { useMutation } from "@tanstack/react-query";
import { AssetService, UploadAssetParams } from "@/services/asset.service";

export const useUploadAsset = () => {
  return useMutation({
    mutationFn: async (params: UploadAssetParams) => {
      const data = await AssetService.upload(params);
      return data;
    },
  });
};
