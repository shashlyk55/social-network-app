import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

import {
  AccountProviderType,
  AuthResult,
  InternalAuthResult,
  LogoutParams,
  OAuthCallbackParams,
  SignupParams,
  TokenResult,
} from '../types/auth-params.types';
import { CreateProfileParams } from 'src/profiles/types/profile-params.types';
import { AuthMapper } from '../utils/auth.mapper';
import { ProfilesService } from 'src/profiles/profiles.service';
import { ProfileMapper } from 'src/profiles/utils/profile.mapper';

@Injectable()
export class OrchestratorAuthService {
  constructor(
    private readonly authService: AuthService,
    private readonly profilesService: ProfilesService,
  ) {}

  async signup(params: SignupParams): Promise<AuthResult> {
    let createdUserId: number | null = null;
    let isProfileCreated: boolean = false;

    try {
      const internalAuthData: InternalAuthResult =
        await this.authService.handleSignup(params.auth);
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

  async handleOAuthInit(
    provider: AccountProviderType,
  ): Promise<{ url: string }> {
    return await this.authService.handleOAuthInit(provider);
  }

  async handleOAuthCallback(params: OAuthCallbackParams): Promise<TokenResult> {
    //console.log('HANDLE OAUTH CALLBACK');

    let isProfileCreated: boolean = false;
    let createdUserId: number | null = null;

    try {
      const authData = await this.authService.handleOAuthCallback(params);
      //console.log(authData);

      let profile = await this.profilesService.getByUserId(authData.user.id);

      if (!profile) {
        createdUserId = authData.user.id;
        const username = authData.profile.email.split('@')[0];

        profile = await this.profilesService.create({
          userId: authData.user.id,
          displayName: authData.profile.name,
          avatarUrl: authData.profile.avatarUrl,
          createdById: authData.user.id,
          isPublic: true,
          username: username,
        });

        isProfileCreated = true;
      }

      //console.log(profile);
      //const result = AuthMapper.toAuthResult(authData, profile);
      const result: TokenResult = {
        accessToken: authData.tokens.accessToken,
        refreshToken: authData.tokens.refreshToken,
      };

      return result;
    } catch (error) {
      // console.log('ERROR');
      // console.log(createdUserId);
      // console.log(isProfileCreated);

      if (createdUserId && !isProfileCreated) {
        //console.log('ROLLBACK REGISTRATION');

        await this.authService.rollbackRegistration(createdUserId);
      }
      throw error;
    }
  }
}
