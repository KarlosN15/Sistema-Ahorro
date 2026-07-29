import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateIncomeDto } from './dto/income.dto';

@Injectable()
export class IncomesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: CreateIncomeDto) {
    return this.prisma.income.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : new Date(),
        userId,
      },
    });
  }

  async findAll(userId: number, page?: number, limit?: number) {
    const args: any = {
      where: { userId },
      include: { service: true },
      orderBy: { date: 'desc' },
    };

    if (page !== undefined && limit !== undefined) {
      args.skip = (page - 1) * limit;
      args.take = limit;
    }

    const data = await this.prisma.income.findMany(args);
    const total = await this.prisma.income.count({ where: { userId } });

    return {
      data,
      total,
      page: page || 1,
      limit: limit || total,
    };
  }

  update(id: number, userId: number, data: any) {
    return this.prisma.income.update({
      where: { id, userId },
      data,
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.income.delete({
      where: { id, userId },
    });
  }
}
