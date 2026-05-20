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
  Req,
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

@ApiTags('follow')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden resource' })
@UseGuards(AccessGuard)
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get('following')
  @ApiOperation({ summary: 'Список моих подписок (на кого я подписан)' })
  @ApiQuery({ name: 'status', enum: FollowStatusFilter, required: false })
  async getMyFollowing(
    @CurrentUser('userId') userId: number,
    @Query('status') status: FollowStatusFilter = FollowStatusFilter.ALL,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const followDirection = FollowDirection.FOLLOWING;
    const result = await this.followService.getFollows(
      userId,
      followDirection,
      status,
      page,
      limit,
    );

    return FollowMapper.toPaginationResponse(result, followDirection);
  }

  @Get('followers')
  @ApiOperation({ summary: 'Список моих подписчиков (кто подписан на меня)' })
  @ApiQuery({ name: 'status', enum: FollowStatusFilter, required: false })
  async getMyFollowers(
    @CurrentUser('userId') userId: number,
    @Query('status') status: FollowStatusFilter = FollowStatusFilter.ALL,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const followDirection = FollowDirection.FOLLOWERS;
    const result = await this.followService.getFollows(
      userId,
      followDirection,
      status,
      page,
      limit,
    );

    return FollowMapper.toPaginationResponse(result, followDirection);
  }

  @Post(':targetProfileId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Подписаться на профиль' })
  @ApiResponse({
    status: 201,
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
    return await this.followService.follow(userId, targetProfileId);
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
