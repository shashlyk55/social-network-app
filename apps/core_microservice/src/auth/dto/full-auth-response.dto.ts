export class FullAuthResponseDto {
  profile: ProfileResponseDto;
  user: UserResponseDto;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class UserResponseDto {
  role: string;
  disabled: boolean;
}

export class ProfileResponseDto {
  username: string;
  displayName: string;
  birthday: string;
  bio?: string;
  avatarUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
