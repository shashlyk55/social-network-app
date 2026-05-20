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
  Query,
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
import { ProfilePreviewDto } from './dto/profile-preview.dto';

@ApiTags('profiles')
@ApiBearerAuth('access-token')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden resource' })
@UseGuards(AccessGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  async getMe(@CurrentUser('userId') currentUserId: number) {
    const currentUserProfile =
      await this.profilesService.findByUserId(currentUserId);
    return plainToInstance(MyProfileDto, currentUserProfile, {
      excludeExtraneousValues: true,
    });
  }

  @Get('search')
  async search(
    @Query('query') query: string,
    @CurrentUser('userId') userId: number,
  ) {
    const result = await this.profilesService.searchProfiles(query, userId);
    console.log(result);

    return plainToInstance(ProfilePreviewDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(
    @Param('id') id: number,
    @CurrentUser('userId') currentUserId: number,
  ) {
    const targetProfile = await this.profilesService.findOne(id);
    const currentUserProfile =
      await this.profilesService.findByUserId(currentUserId);

    const existingFollow = await this.profilesService.findFollow(
      currentUserProfile.id,
      targetProfile.id,
    );

    const isFollowed = existingFollow !== null;
    const isFollowAccepted = existingFollow?.accepted ?? false;
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

  @Patch()
  @HttpCode(200)
  async update(
    @CurrentUser('userId') userId: number,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const params = ProfileMapper.toUpdateParams(updateProfileDto, userId);
    const updatedProfile = await this.profilesService.update(userId, params);
    return plainToInstance(MyProfileDto, updatedProfile, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    this.profilesService.remove(id);
  }
}
