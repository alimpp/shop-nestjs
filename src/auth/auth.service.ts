import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import { AdminService } from 'src/admin/admin.service';
import { UsersService } from 'src/users/users.service';
import { OtpService } from '../otp/otp.service';

import { AuthJwtPayload } from './types/auth-jwtPayload';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly adminService: AdminService,
  ) {}

  async requestOtp(phoneNumber: string) {
    const otp = await this.otpService.generateOtp(phoneNumber);

    console.log(`OTP for ${phoneNumber}: ${otp}`);

    return {
      message: 'کد تایید ارسال شد',
    };
  }

  async verifyOtp(phoneNumber: string, otp: string) {
    const isValid = await this.otpService.verifyOtp(phoneNumber, otp);

    if (!isValid) {
      throw new UnauthorizedException('کد تایید نامعتبر است');
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

    const payload = {
      sub: user.id,
      phoneNumber: user.phone,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(phone: string) {
    const user = await this.usersService.getUserByPhone(phone);

    if (!user) {
      throw new UnauthorizedException('کاربر یافت نشد');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const admin = await this.adminService.findAdmin(dto.username, dto.password);

    if (!admin) {
      throw new UnauthorizedException('نام کاربری یا رمز عبور اشتباه است');
    }

    const token = await this.adminLogin(admin.id);

    return {
      id: admin.id,
      username: admin.username,
      token,
    };
  }

  async loginUser(userId: number) {
    const payload: AuthJwtPayload = {
      sub: userId,
      role: 'admin',
    };

    return this.jwtService.sign(payload);
  }

  async adminLogin(adminId: string) {
    const payload: AuthJwtPayload = {
      sub: adminId,
      role: 'admin',
    };

    return this.jwtService.sign(payload);
  }
}
