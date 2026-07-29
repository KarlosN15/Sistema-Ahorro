import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateExpenseDto } from './dto/expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, data: CreateExpenseDto) {
    return this.prisma.expense.create({
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
      include: { category: true },
      orderBy: { date: 'desc' },
    };

    if (page !== undefined && limit !== undefined) {
      args.skip = (page - 1) * limit;
      args.take = limit;
    }

    const data = await this.prisma.expense.findMany(args);
    const total = await this.prisma.expense.count({ where: { userId } });

    return {
      data,
      total,
      page: page || 1,
      limit: limit || total,
    };
  }

  update(id: number, userId: number, data: any) {
    return this.prisma.expense.update({
      where: { id, userId },
      data,
    });
  }

  remove(id: number, userId: number) {
    return this.prisma.expense.delete({
      where: { id, userId },
    });
  }
}
