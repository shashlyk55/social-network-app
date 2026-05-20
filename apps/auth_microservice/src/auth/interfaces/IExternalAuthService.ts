import { AccountProviderType } from 'src/entities/account.entity';
import { OAuthProfile } from '../types/external-auth.types';

export interface IExternalAuthService {
  exchangeCodeForProfile(
    code: string,
    provider: AccountProviderType,
  ): Promise<OAuthProfile>;
  getRedirectUrl(provider: AccountProviderType): string;
}
