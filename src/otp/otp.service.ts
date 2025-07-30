import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
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

    // Store the secret in cache with phone number as key
    await this.cacheManager.set(phoneNumber, secret.base32, { ttl: 300 }); // 5 minutes expiry

    return token;
  }

  async verifyOtp(phoneNumber: string, token: string): Promise<boolean> {
    const secret = await this.cacheManager.get<string>(phoneNumber);
    if (!secret) return false;

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1, // Allow 1 step (30 seconds) before/after current time
    });

    // Remove OTP from cache after verification (whether successful or not)
    await this.cacheManager.del(phoneNumber);

    return verified;
  }
}