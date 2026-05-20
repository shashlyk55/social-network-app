import { Expose } from 'class-transformer';

export class BaseProfileDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  displayName: string;

  @Expose()
  bio?: string | null;

  @Expose()
  isPublic: boolean;

  @Expose()
  avatarUrl?: string | null;

  @Expose() // Скрыто для приватного профиля
  followersCount: number;

  @Expose() // Скрыто для приватного профиля
  followedCount: number;
}
