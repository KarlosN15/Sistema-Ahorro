import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateServiceDto) {
    return this.prisma.service.create({ data });
  }

  async findAll() {
    return this.prisma.service.findMany({
      orderBy: { id: 'desc' }
    });
  }

  update(id: number, updateServiceDto: any) {
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  remove(id: number) {
    return this.prisma.service.delete({
      where: { id },
    });
  }
}
