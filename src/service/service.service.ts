import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ServiceProps, ServiceServiceInterface } from './service.interface';
import { API } from 'src/api/Api';

@Injectable()
export class ServiceService implements ServiceServiceInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(SessionValue: string) {
    const { data } = await API().post('Services/GetServiceList', SessionValue);

    console.log(data);

    return data;

    // return await this.prismaService.service.findMany({
    //   select: {
    //     id: true,
    //     name: true,
    //   },
    //   orderBy: {
    //     name: 'asc',
    //   },
    // });
  }

  async get(cod: string) {
    const response: ServiceProps[] = await this.prismaService.service.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
      where: {
        name: {
          contains: cod,
        },
      },
    });

    const arrUnique = new Set();
    const serviceList = [];

    for (const service of response) {
      const split = service.name.split('::');

      if (!arrUnique.has(split[2])) {
        arrUnique.add(split[2]);
        serviceList.push({
          cod: `${split[0]}::${split[1]}::${split[2]}`,
          title: split[2],
          id: service.id,
          icon: 'PhBrowsers',
          // description: '', //split[3],
        });
      }
    }

    // Ordenar por title em ordem ascendente
    serviceList.sort((a, b) => a.title.localeCompare(b.title));

    return serviceList;
  }
  async search(word: string, catalogCod: string) {
    const response: ServiceProps[] = await this.prismaService.service.findMany({
      orderBy: {
        name: 'asc',
      },
      where: {
        name: {
          contains: catalogCod,
        },
        OR: [
          {
            name: {
              contains: word,
            },
          },
        ],
      },
    });

    return await Promise.all(
      response.map((catalog: ServiceProps) => {
        const split = catalog.name.split('::');

        return {
          cod: split[0] + split[1] + split[2] + split[3],
          title: split[4],
          id: catalog.id,
        };
      }),
    );
  }
}
