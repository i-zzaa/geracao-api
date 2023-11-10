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

  async getNetwork(notes: any) {
    return {
      nodes: [
        { id: 1, name: 'DO' },
        { id: 2, name: 'RE' },
        { id: 3, name: 'MI' },
        { id: 4, name: 'FA' },
        { id: 5, name: 'SOL' },
        { id: 6, name: 'LA' },
        { id: 7, name: 'SI' },
      ],
      links: [
        { sid: 1, tid: 2 },
        { sid: 2, tid: 4 },
        { sid: 3, tid: 4 },
        { sid: 4, tid: 5 },
        { sid: 5, tid: 6 },
        { sid: 7, tid: 6 },
        { sid: 5, tid: 6 },
        { sid: 3, tid: 7 },
        { sid: 7, tid: 6 },
      ],
    };
  }
}
