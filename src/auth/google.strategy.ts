import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { configDotenv } from 'dotenv';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

configDotenv();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly _config: ConfigService) {
    super({
      clientID: _config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: _config.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: _config.get<string>('CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name: `${name.givenName} ${name.familyName}`,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
