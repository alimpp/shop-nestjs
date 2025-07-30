import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { CreateDto } from 'src/users/dto/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(phone) {
    return await this.usersService.createUser(phone);
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
