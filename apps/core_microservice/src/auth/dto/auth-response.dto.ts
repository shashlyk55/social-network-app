export class InternalAuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: InternalUserResponseDto;
}

export class InternalUserResponseDto {
  id: number;
  role: string;
  disabled: boolean;
}
