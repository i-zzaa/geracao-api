import { Injectable } from '@nestjs/common';
import { UserProps } from './user.interface';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserAuth(username: string): Promise<any | undefined> {
    const user: UserProps = await this.prismaService.user.findFirstOrThrow({
      select: {
        id: true,
        name: true,
        login: true,
        password: true,
        profile: true,
        active: true,
      },
      where: {
        login: username,
      },
    });

    return user;
  }

  async getAll(page: any, pageSize: any): Promise<any | undefined> {
    const user: any = await this.prismaService.user.findFirstOrThrow({
      select: {
        id: true,
        name: true,
        login: true,
        profile: true,
        active: true,
      },
      where: {
        active: true,
      },
    });

    return user;
  }

  async create(body: UserProps) {
    body.password = bcrypt.hashSync('12345678', 8);

    const user: any = await this.prismaService.user.create({
      select: {
        name: true,
        login: true,
        id: true,
        profile: true,
      },
      data: {
        name: body.name.toUpperCase(),
        login: body.login.toLowerCase(),
        profileId: body.profileId,
        password: body.password,
      },
    });

    if (!user) return;

    return user;
  }

  async updatePassword(userId: number) {
    const senha = bcrypt.hashSync('12345678', 8);
    const user = await this.prismaService.user.update({
      data: {
        password: senha,
      },
      where: {
        id: Number(userId),
      },
    });

    return user;
  }

  async updatePasswordLogin(login: string, data: any) {
    const password = bcrypt.hashSync(data.password.toString(), 8);

    const user = await this.prismaService.user.update({
      data: {
        password: password,
      },
      where: {
        login,
      },
    });

    return {};
  }
}
