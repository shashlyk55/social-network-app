import { ProfileFollow } from 'src/entities/many-to-many/profile-follow.entity';

export type FollowPaginationResult = {
  data: ProfileFollow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
