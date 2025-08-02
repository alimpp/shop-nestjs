import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { CreateDto } from 'src/users/dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}
  async requestOtp(phoneNumber: string): Promise<{ success: boolean }> {
    const otp = await this.otpService.generateOtp(phoneNumber);
    console.log(`OTP for ${phoneNumber}: ${otp}`);
    return { success: true };
  }

  async verifyOtp(
    phoneNumber: string,
    otp: string,
  ): Promise<{ accessToken: string }> {
    const isValid = await this.otpService.verifyOtp(phoneNumber, otp);
    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP');
    }
    let user = await this.usersService.getUserByPhone(phoneNumber);
    if (!user) {
      user = await this.usersService.createUser({
        phone: phoneNumber,
        fristname: '',
        lastname: '',
        email: '',
        avatarUrl: '',
      });
    }
    const payload = { sub: user.id, phoneNumber: user.phone };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(phone: string) {
    const user = await this.usersService.getUserByPhone(phone);
    if (!user) throw new UnauthorizedException('User not found');
    return { id: user.id };
  }

  async login(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}
