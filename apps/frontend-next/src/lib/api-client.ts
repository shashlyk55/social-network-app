import axios from "axios";
import { getErrorMessage } from "./error-handler";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Здесь мы подменяем стандартное поле message у объекта ошибки
    // чтобы TanStack Query и другие инструменты видели уже чистую строку
    error.displayMessage = getErrorMessage(error);

    return Promise.reject(error);
  }
);
