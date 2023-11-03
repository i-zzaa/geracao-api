import { Injectable } from '@nestjs/common';
import { MusicServiceInterface } from './music.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class MusicService implements MusicServiceInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    try {
      const data = await this.prismaService.music.findMany({
        select: {
          id: true,
          name: true,
          artist: true,
          music: true,
          notes: true,
        },
      });

      return data;
    } catch (error) {
      new Error(error.message);
    }
  }

  async get(filter: any) {
    try {
      const data = await this.prismaService.music.findMany({
        select: {
          id: true,
          name: true,
          artist: true,
          music: true,
          notes: true,
        },
        where: {
          id: {
            in: filter.notes,
          },
        },
      });

      return data;
    } catch (error) {
      new Error(error.message);
    }
  }

  async search(notes: string[]) {
    try {
      const data = await this.prismaService.music.findMany({
        select: {
          id: true,
          name: true,
          artist: true,
          music: true,
          notes: true,
        },
        // where: {
        //   notes: notes,
        // },
      });

      return data;
    } catch (error) {
      new Error(error.message);
    }
  }

  async create(body: any) {
    try {
      const data = await this.prismaService.music.create({
        data: {
          name: body.name,
          artist: body.artist,
          music: body.artist,
          notes: body.notes,
        },
      });

      return data;
    } catch (error) {
      new Error(error.message);
    }
  }
}
