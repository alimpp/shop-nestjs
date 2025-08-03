import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  async requestOtp(@Body('phoneNumber') phoneNumber: string) {
    return this.authService.requestOtp(phoneNumber);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
  ) {
    return this.authService.verifyOtp(phoneNumber, otp);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: {username: string, password: string}) {    
    const admin = await this.authService.validateAdmin(body)
    if(admin) {
      const token = await this.authService.adminLogin(admin.id);
      return {
        id: admin.id,
        token,
      };
    }
  }
}
