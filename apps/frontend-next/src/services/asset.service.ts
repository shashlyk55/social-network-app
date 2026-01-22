import { apiClient } from "@/lib/api-client";

export enum FileType {
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  DOCUMENT = "document",
}

export const AssetService = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("orderIndex", "0");
    formData.append("fileType", FileType.IMAGE);

    const response = await apiClient.post("/assets/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
