import { Injectable } from '@nestjs/common';
import { MusicProps, MusicServiceInterface } from './music.interface';
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
          link: true,
          noteMusic: {
            select: {
              note: true,
            },
          },
        },
      });

      return data;
    } catch (error) {
      new Error(error.message);
    }
  }

  async getAllNotes() {
    try {
      const data = await this.prismaService.note.findMany({
        select: {
          id: true,
          name: true,
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
          noteMusic: true,
          link: true,
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
          noteMusic: true,
          link: true,
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

  async create(body: MusicProps) {
    if (body.id) {
      await this.prismaService.noteMusic.deleteMany({
        where: { musicId: body.id },
      });

      await this.prismaService.music.update({
        data: {
          name: body.name,
          artist: body.artist,
          link: body.link,
          music: body.music,
          noteMusic: {
            create: body.noteMusic.map((note) => ({
              noteId: Number(note.id),
            })),
          },
        },
        where: {
          id: body.id,
        },
        include: {
          noteMusic: {
            include: {
              note: true,
            },
          },
        },
      });
    } else {
      await this.prismaService.music.create({
        data: {
          name: body.name,
          artist: body.artist,
          link: body.link,
          music: body.music,
          noteMusic: {
            create: body.noteMusic.map((note) => ({
              noteId: Number(note.id),
            })),
          },
        },
      });
    }
  }
}
