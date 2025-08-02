import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(phone: string): Promise<any> {
    const user = await this.authService.validateUser(phone);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return user;
  }
}
