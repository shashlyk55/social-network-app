import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { FollowResponseDto } from '../dto/follow-response.dto';
import { FollowPaginationResult } from '../types/follow-params.types';
import { ProfileFollow } from 'src/entities/many-to-many/profile-follow.entity';
import { ProfilePreviewResponseDto } from 'src/profiles/dto/profile-preview-response.dto';
import { FollowDirection } from '../follow.service';

export class FollowMapper {
  static toFollowResponse(
    follow: ProfileFollow,
    direction: FollowDirection,
  ): FollowResponseDto {
    const profileEntity =
      direction === FollowDirection.FOLLOWING
        ? follow.followedProfile
        : follow.followerProfile;

    const profileDto: ProfilePreviewResponseDto = {
      id: profileEntity.id,
      username: profileEntity.username,
      displayName: profileEntity.displayName,
      avatarUrl: profileEntity.avatarUrl,
      isPublic: profileEntity.isPublic,
    };

    const response: FollowResponseDto = {
      id: follow.id,
      accepted: follow.accepted,
      createdAt: follow.createdAt,
      profile: profileDto,
    };

    return response;
  }

  static toPaginationResponse(
    result: FollowPaginationResult,
    direction: FollowDirection,
  ): PaginationResponseDto<FollowResponseDto> {
    return {
      data: result.data.map((follow) =>
        this.toFollowResponse(follow, direction),
      ),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}
