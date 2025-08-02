import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as speakeasy from 'speakeasy';

@Injectable()
export class OtpService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async generateOtp(phoneNumber: string): Promise<string> {
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    await this.cacheManager.set(phoneNumber, secret.base32, 300000);
    return token;
  }

  async verifyOtp(phoneNumber: string, token: string): Promise<boolean> {
    const secret = await this.cacheManager.get<string>(phoneNumber);
    if (!secret) return false;
    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });
    await this.cacheManager.del(phoneNumber);
    return verified;
  }
}
