import { ProfileMapper } from 'src/profiles/utils/profile.mapper';
import { FullAuthResponseDto } from '../dto/full-auth-response.dto';
import { FullRegisterDto } from '../dto/full-register.dto';
import { AuthResult, SignUpParams } from '../types/auth-params.types';

export class OrchestratorAuthMapper {
  static toSignupParams(dto: FullRegisterDto): SignUpParams {
    return {
      auth: {
        email: dto.email,
        password: dto.password,
        role: dto.role,
        provider: dto.provider,
        providerId: dto.providerId,
        createdById: dto.createdById,
      },
      profile: {
        username: dto.username,
        displayName: dto.displayName,
        birthday: new Date(dto.birthday),
        bio: dto.bio,
        avatarUrl: dto.avatarUrl,
        isPublic: dto.isPublic,
        userId: 0,
        createdById: 0,
      },
    };
  }

  static toResponseDto(result: AuthResult): FullAuthResponseDto {
    const profile = result.profile;
    return {
      tokens: {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
      user: result.user,
      profile: {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        birthday: new Date(result.profile.birthday),
        bio: profile.bio ? profile.bio : undefined,
        avatarUrl: profile.avatarUrl ? profile.avatarUrl : undefined,
        isPublic: profile.isPublic,
        createdAt: profile.createdAt,
      },
    };
  }
}
