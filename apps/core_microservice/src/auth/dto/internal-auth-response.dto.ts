export class InternalAuthDto {
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  user: InternalUserDto;
}

export class InternalUserDto {
  id: number;
  role: string;
  disabled: boolean;
}
