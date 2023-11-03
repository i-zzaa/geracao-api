import { Injectable } from '@nestjs/common';
import { PROFILE_ID, UserProps } from './user.interface';
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

  async getAll(
    page: any,
    pageSize: any,
    filter: any,
  ): Promise<any | undefined> {
    const skip = (page - 1) * pageSize;

    const user: any = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        login: true,
        profile: true,
        active: true,
      },
      where: {
        active: true,
        // ...filter,
      },

      skip,
      take: pageSize,
    });

    const totalRecords = await this.prismaService.user.count();

    return {
      data: user,
      totalRecords,
    };
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

    if (body.profileId === PROFILE_ID.aluno) {
      await this.prismaService.class.create({
        data: {
          userId: user.id,
          instrumentId: body.instrumentId,
          teacherId: body.teacherId,
          week: body.week,
          start: body.start,
          end: body.end,
        },
      });
    }

    if (!user) return;

    return user;
  }

  async getProfile() {
    return await this.prismaService.profile.findMany({
      select: {
        id: true,
        name: true,
      },
    });
  }

  async getTeacher() {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        profileId: PROFILE_ID.professor,
      },
    });
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
