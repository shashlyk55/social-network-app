import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileMapper } from './utils/profile.mapper';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { plainToInstance } from 'class-transformer';
import { MyProfileDto } from './dto/my-profile-view.dto';
import { OtherProfileDto } from './dto/other-profile-view.dto';

@ApiTags('profiles')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden resource' })
@UseGuards(AccessGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':username')
  @HttpCode(200)
  async getMe(
    @Param('username') username: string,
    @CurrentUser('userId') currentUserId: number,
  ) {
    const targetProfile = await this.profilesService.findByUsername(username);
    const currentUserProfile =
      await this.profilesService.findByUserId(currentUserId);

    if (targetProfile.id === currentUserProfile.id) {
      return plainToInstance(MyProfileDto, targetProfile, {
        excludeExtraneousValues: true,
      });
    }

    const existingFollow = await this.profilesService.findFollow(
      currentUserProfile.id,
      targetProfile.id,
    );

    const isFollowed = existingFollow !== null;
    const isFollowAccepted = !!existingFollow;
    const canViewFullProfile = targetProfile.isPublic || isFollowAccepted;

    return plainToInstance(
      OtherProfileDto,
      {
        ...targetProfile,
        isFollowed,
        isFollowAccepted,
        canViewFullProfile,
      },
      { excludeExtraneousValues: true },
    );
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id') id: number) {
    return ProfileMapper.toResponseDto(await this.profilesService.findOne(id));
  }

  @Patch()
  @HttpCode(200)
  async update(
    @CurrentUser('userId') userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const params = ProfileMapper.toUpdateParams(updateProfileDto, userId);
    return ProfileMapper.toResponseDto(
      await this.profilesService.update(userId, params),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    this.profilesService.remove(id);
  }
}
