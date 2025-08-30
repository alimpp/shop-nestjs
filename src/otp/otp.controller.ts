import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  
  constructor(private readonly otpService: OtpService) {}

  @Post('request')
  async requestOtp(@Body('phoneNumber') phoneNumber: string) {
    return this.otpService.generateOtp(phoneNumber);
  }
  
}
