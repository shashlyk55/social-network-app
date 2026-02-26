import { apiClient } from "@/lib/api-client";
import { LoginCredentials, SignupCredentials } from "@/types/auth";

export const authService = {
  async signup(data: SignupCredentials): Promise<undefined> {
    await apiClient.post("auth/signup", data);
  },

  async login(data: LoginCredentials): Promise<undefined> {
    await apiClient.post("auth/login/local", data);
  },

  async logout() {
    await apiClient.post("auth/logout");
  },
};
