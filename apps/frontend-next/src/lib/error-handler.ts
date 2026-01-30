import { ApiError } from "@/types/errors";

export const getErrorMessage = (error: ApiError): string => {
  const data = error.response?.data;

  if (Array.isArray(data?.message)) {
    return data.message[0];
  }

  if (data?.error?.message) {
    return data.error.message;
  }

  if (data?.message) {
    return data.message;
  }

  return "Unknown error";
};
