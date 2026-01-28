import { apiClient } from "@/lib/api-client";
import { Asset } from "@/types/asset";

export interface UploadAssetParams {
  file: File;
  orderIndex?: number;
}

export const AssetService = {
  upload: async ({ file, orderIndex = 0 }: UploadAssetParams) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderIndex", orderIndex.toString());
    //formData.append("fileType", FileType.IMAGE);

    const response = await apiClient.post<Asset>("/assets/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
