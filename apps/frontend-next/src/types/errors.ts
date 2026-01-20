export interface ApiError {
  response?: {
    data?: {
      error?: {
        message?: string;
        code?: string;
      };
      message?: string;
    };
  };
}

export interface AuthErrorResponse {
  error?: {
    message?: string;
  };
  message?: string;
}
