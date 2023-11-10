import { Injectable } from '@nestjs/common';
import { MusicProps, MusicServiceInterface } from './music.interface';
import { PrismaService } from 'src/prisma.service';
import { gerarCorAleatoriaHex } from 'src/util/color';

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

  frequencyNotes(musicasComNota) {
    const notasFrequentes = {};
    const notasIdsFrequentes = {};

    musicasComNota.forEach((musica) => {
      const notas = musica.noteMusic; // Assumindo que 'noteMusic' é um array de notas na sua estrutura de dados

      for (let i = 0; i < notas.length - 1; i++) {
        const notaAtual = `${notas[i].note.name}${notas[i].noteId}`;
        const proximaNota = `${notas[i + 1].note.name}${notas[i + 1].noteId}`;

        const notaAtualKey = notas[i].noteId;
        const proximaNotaKey = notas[i + 1].noteId;

        // Contar a frequência das notas seguintes
        const key = `${notaAtual}-${proximaNota}`;
        const keyIds = `${notaAtualKey}-${proximaNotaKey}`;

        notasFrequentes[key] = (notasFrequentes[key] || 0) + 1;
        notasIdsFrequentes[keyIds] = (notasIdsFrequentes[keyIds] || 0) + 1;
      }
    });

    return {
      names: notasFrequentes,
      ids: notasIdsFrequentes,
    };
  }

  transformFrequency(notasFrequentes) {
    // Suponha que 'notasFrequentes' seja o objeto com a contagem de frequência de repetição de notas

    const nodes = [];
    const links = [];

    // Criar uma lista de nós (nodes) únicos
    const notasUnicas = [
      ...new Set(
        Object.keys(notasFrequentes.names).flatMap((key) => key.split('-')),
      ),
    ];

    // Calcular o total de repetições
    const totalRepeticoes: any = Object.values(notasFrequentes.ids).reduce(
      (acc: any, count: any) => acc + count,
      0,
    );

    notasUnicas.forEach((nota, index) => {
      const id = nota.match(/\d+$/)[0];
      const name = nota.replace(/\d/g, '');

      const frequencia = Object.keys(notasFrequentes.names).filter((n) =>
        n.includes(nota),
      ).length;

      const porcentagem = (frequencia / totalRepeticoes) * 100;

      nodes.push({
        id: id,
        name: name,
        _size: porcentagem / 4,
      });
    });

    // Criar uma lista de links com base na contagem de frequência em porcentagem
    for (const key in notasFrequentes.ids) {
      const [sid, tid] = key.split('-');
      const frequencia = notasFrequentes.ids[key];
      const porcentagem = (frequencia / totalRepeticoes) * 100;

      links.push({
        sid: parseInt(sid),
        tid: parseInt(tid),
        frequencia: porcentagem,
      });
    }

    return { nodes, links };
  }

  async getNetwork(notes: any) {
    const data = await this.prismaService.music.findMany({
      select: {
        name: true,
        artist: true,
        link: true,
        music: true,
        noteMusic: {
          select: {
            noteId: true,
            note: true,
          },
        },
      },
      where: {
        noteMusic: {
          some: {
            noteId: Number(notes.noteId),
          },
        },
        name: {
          contains: notes.name,
        },
      },
    });

    const notasFrequentes = this.frequencyNotes(data);
    const result = this.transformFrequency(notasFrequentes);

    return {
      network: { ...result },
      data,
    };
  }
}
