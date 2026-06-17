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

  async findAll(userId: number) {
    return this.prisma.income.findMany({
      where: { userId },
      include: { service: true },
      orderBy: { date: 'desc' },
    });
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
