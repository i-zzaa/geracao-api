import { Injectable } from '@nestjs/common';
import { LocationServiceInterface } from './location.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class LocationService implements LocationServiceInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    try {
      const data = await this.prismaService.location.findMany({
        select: {
          id: true,
          name: true,
        },
        where: {
          active: true,
        },
      });

      return data;
    } catch (error) {
      new Error(error.message);
    }
  }

  async search(word: string) {
    try {
      const data = await this.prismaService.location.findMany({
        select: {
          id: true,
          name: true,
        },
        // where: {
        //   name: {
        //     contain: word,
        //   },
        // },
      });

      return data;
    } catch (error) {
      new Error(error.message);
    }
  }

  async create(body: any) {
    try {
      const data = await this.prismaService.location.create({
        data: {
          name: body.name,
        },
      });

      return data;
    } catch (error) {
      new Error(error.message);
    }
  }
}
