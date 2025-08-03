import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import { OtpService } from '../otp/otp.service';
import { AdminService } from 'src/admin/admin.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly adminService: AdminService
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

  async validateAdmin(body: {username: string, password: string}) {
    const admin = await this.adminService.findAdmin(body.username, body.password)
    if(!admin) throw new NotFoundException('Not found admin')
    return admin 
  }

  async login(userId: number) {
    const payload: AuthJwtPayload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  async adminLogin(adminId: string) {
    const payload: AuthJwtPayload = { sub: adminId };
    return this.jwtService.sign(payload);
  }
}
