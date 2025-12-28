import axios from 'axios';
import { AccountProviderType } from '../entities/account.entity';
import { IExternalAuthService } from './interfaces/IExternalAuthService';
import {
  OAuthProfile,
  OAuthProvidersConfig,
} from './types/external-auth.types';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import { Octokit } from 'octokit';

export class ExternalAuthService implements IExternalAuthService {
  private createGoogleClient() {
    return new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_OAUTH_REDIRECT_URI,
    );
  }

  getRedirectUrl(provider: AccountProviderType): string {
    if (provider === AccountProviderType.GOOGLE) {
      const client = this.createGoogleClient();
      return client.generateAuthUrl({
        access_type: 'offline', // for getting refresh_token
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
        ],
      });
    }

    // if (provider === AccountProviderType.GITHUB) {
    //   const params = new URLSearchParams({
    //     client_id: process.env.GITHUB_CLIENT_ID!,
    //     redirect_uri: process.env.OAUTH_REDIRECT_URI!,
    //     scope: 'read:user user:email',
    //   });
    //   return `https://github.com/login/oauth/authorize?${params.toString()}`;
    // }

    throw new Error('Provider not supported');
  }

  async exchangeCodeForProfile(
    code: string,
    provider: AccountProviderType,
  ): Promise<OAuthProfile> {
    if (provider === AccountProviderType.GOOGLE) {
      return this.handleGoogleExchange(code);
    }
    // if (provider === AccountProviderType.GITHUB) {
    //   return this.handleGithubExchange(code);
    // }
    throw new Error('Provider not supported');
  }

  private async handleGoogleExchange(code: string): Promise<OAuthProfile> {
    const client = this.createGoogleClient();

    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: client });
    const { data } = await oauth2.userinfo.get();

    console.log(data);

    return {
      email: data.email!,
      name: data.name || data.given_name!,
      providerId: data.id!,
      avatarUrl: data.picture || undefined,
    };
  }

  private async handleGithubExchange(code: string): Promise<OAuthProfile> {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        }),
      },
    );
    const { access_token } = await response.json();

    const octokit = new Octokit({ auth: access_token });
    const { data } = await octokit.users.getAuthenticated();

    return {
      email: data.email || data.login,
      name: data.name || data.login,
      providerId: String(data.id),
      avatarUrl: data.avatar_url,
    };
  }
}
