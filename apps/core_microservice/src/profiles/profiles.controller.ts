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
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileMapper } from './utils/profile.mapper';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

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
