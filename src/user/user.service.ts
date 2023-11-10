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

    const query = {};

    if (filter.locationId) query['locationId'] = Number(filter.locationId);
    if (filter.profileId) query['profileId'] = Number(filter.profileId);

    const user: any = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        login: true,
        profile: true,
        location: {
          select: {
            id: true,
            name: true,
          },
        },
        enrolledClasses: {
          select: {
            week: true,
            start: true,
            end: true,
            instrument: {
              select: {
                name: true,
                id: true,
              },
            },
            teacher: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        },
        active: true,
      },
      where: {
        active: true,
        name: {
          contains: filter.name,
        },
        login: {
          contains: filter.login,
        },
        ...query,
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
    const user = await this.prismaService.user.create({
      select: {
        name: true,
        login: true,
        id: true,
        profile: true,
        location: true,
      },
      data: {
        name: body.name.toUpperCase(),
        login: body.login.toLowerCase(),
        profileId: Number(body.profileId),
        locationId: Number(body.locationId),
        password: body.password,
      },
    });

    if (Number(body.profileId) === PROFILE_ID.aluno) {
      try {
        await Promise.all(
          body.classes.map(
            async (item: any) =>
              await this.prismaService.class.create({
                data: {
                  userId: user.id,
                  instrumentId: Number(item.instrumentId),
                  teacherId: Number(item.teacherId),
                  week: item.week,
                  start: item.start,
                  end: item.end,
                },
              }),
          ),
        );
      } catch (error) {
        console.log(error);
      }
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
