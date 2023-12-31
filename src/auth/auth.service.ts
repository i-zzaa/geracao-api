import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { UserProps } from 'src/user/user.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: UserProps) {
    const payload = {
      sub: user.id,
      username: user.login,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        login: user.login,
        id: user.id,
        profile: user.profile,
        name: user.name,
      },
    };
  }

  async validateUser(login: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findUserAuth(login);

      if (!user) return null;

      const checkPassword = bcrypt.compareSync(
        password.toString(),
        user.password,
      );

      if (user && checkPassword && user.active) {
        const { password, ...result } = user;
        return result;
      }
    } catch (error) {
      return null;
    }
  }
}
