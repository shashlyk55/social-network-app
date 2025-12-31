import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthService } from '../auth.service';

import {
  AuthResult,
  InternalAuthResult,
  LogoutParams,
  SignUpParams,
} from '../types/auth-params.types';
import { CreateProfileParams } from 'src/profiles/types/profile-params.types';
import { AuthMapper } from '../utils/auth.mapper';
import { ProfilesService } from 'src/profiles/profiles.service';
import { ProfileMapper } from 'src/profiles/utils/profile.mapper';
import { InternalAuthDto } from '../dto/internal-auth-response.dto';
import { InternalHttpService } from './internal-http.service';

@Injectable()
export class OrchestratorAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly profilesService: ProfilesService,
  ) {}

  async signup(params: SignUpParams): Promise<AuthResult> {
    let createdUserId: number | null = null;
    let isProfileCreated: boolean = false;

    try {
      const internalAuthData: InternalAuthResult =
        await this.authService.handleSignUp(params.auth);
      createdUserId = internalAuthData.user.id;

      const profileParams: CreateProfileParams = {
        ...params.profile,
        userId: createdUserId,
        createdById: createdUserId,
      };

      const savedProfile = await this.profilesService.create(profileParams);
      isProfileCreated = true;

      const profileResult = ProfileMapper.toResult(savedProfile);

      const result: AuthResult = {
        profile: profileResult,
        user: internalAuthData.user,
        tokens: internalAuthData.tokens,
      };

      return result;
    } catch (error) {
      if (createdUserId && !isProfileCreated) {
        await this.authService.rollbackRegistration(createdUserId);
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string) {
    const authInternalDto = await this.authService.handleRefresh(refreshToken);

    const profile = await this.profilesService.findByUserId(
      authInternalDto.user.id,
    );
    return AuthMapper.toAuthResult(authInternalDto, profile);
  }

  async logout(params: LogoutParams) {
    await this.authService.handleLogout(params);
  }
}
