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

  async findAll(userId: number) {
    return this.prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
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
