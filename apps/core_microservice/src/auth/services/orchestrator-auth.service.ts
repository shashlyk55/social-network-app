import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AuthService } from '../auth.service';

import {
  AuthResult,
  InternalAuthResult,
  SignUpParams,
} from '../types/auth-params.types';
import { CreateProfileParams } from 'src/profiles/types/profile-params.types';
import { AuthMapper } from '../utils/auth.mapper';
import { ProfilesService } from 'src/profiles/profiles.service';
import { ProfileMapper } from 'src/profiles/utils/profile.mapper';

@Injectable()
export class OrchestratorAuthService {
  // TODO: create Orchestrator Service from Registration Service which will include logic with Profiles, Auth and other Services
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
}
