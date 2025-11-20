export type LoginParams = {
  login: string;
  email: string;
};

export type OAuthCallbackParams = {
  authorizationCode: string;
};

export type RefreshParams = {};

export type LogoutParams = {
  refreshTokenId: string;
};

export type ValidateTokenParams = {
  accessToken: string;
};

export type SignUpParams = {};
