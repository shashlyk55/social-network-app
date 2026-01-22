import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  FollowDirection,
  FollowService,
  FollowStatusFilter,
} from './follow.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FollowMapper } from './utils/follow.mapper';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { ProfilePreviewDto } from 'src/profiles/dto/profile-preview.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('follow')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden resource' })
@UseGuards(AccessGuard)
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get(':profileId/followers')
  @ApiOperation({ summary: 'Подписчики пользователя' })
  async getFollowers(
    @Param('profileId', ParseIntPipe) profileId: number,
    @CurrentUser('userId') userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.followService.getFollows(
      userId,
      profileId,
      FollowDirection.FOLLOWERS,
      FollowStatusFilter.ACCEPTED,
      page,
      limit,
    );

    return plainToInstance(PaginationDto<ProfilePreviewDto>, result, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':profileId/following')
  @ApiOperation({ summary: 'Подписки пользователя' })
  async getFollowing(
    @Param('profileId', ParseIntPipe) profileId: number,
    @CurrentUser('userId') userId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.followService.getFollows(
      userId,
      profileId,
      FollowDirection.FOLLOWING,
      FollowStatusFilter.ACCEPTED,
      page,
      limit,
    );

    return plainToInstance(PaginationDto<ProfilePreviewDto>, result, {
      excludeExtraneousValues: true,
    });
  }

  @Post(':targetProfileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Подписаться на профиль' })
  @ApiResponse({
    status: 204,
    description: 'Запрос создан или подписка оформлена',
  })
  @ApiParam({
    name: 'targetProfileId',
    description: 'ID профиля, на который подписываемся',
  })
  async follow(
    @CurrentUser('userId') userId: number,
    @Param('targetProfileId') targetProfileId: number,
  ) {
    await this.followService.follow(userId, targetProfileId);
  }

  @Delete(':targetProfileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Отписаться от профиля' })
  @ApiResponse({ status: 204, description: 'Успешно отписан' })
  async unfollow(
    @CurrentUser('userId') userId: number,
    @Param('targetProfileId') targetProfileId: number,
  ) {
    await this.followService.unfollow(userId, targetProfileId);
  }

  @Patch('accept/:followerProfileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Принять запрос на подписку (для приватных профилей)',
  })
  @ApiResponse({ status: 204, description: 'Запрос принят' })
  async acceptRequest(
    @CurrentUser('userId') userId: number,
    @Param('followerProfileId') followerProfileId: number,
  ) {
    await this.followService.acceptRequest(userId, followerProfileId);
  }

  @Delete('reject/:followerProfileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Отклонить запрос на подписку' })
  @ApiResponse({ status: 204, description: 'Запрос отклонен' })
  async rejectRequest(
    @CurrentUser('userId') userId: number,
    @Param('followerProfileId') followerProfileId: number,
  ) {
    await this.followService.rejectRequest(userId, followerProfileId);
  }
}
