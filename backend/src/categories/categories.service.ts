import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prisma.expenseCategory.create({ data });
  }

  async findAll() {
    return this.prisma.expenseCategory.findMany({
      orderBy: { id: 'desc' }
    });
  }

  update(id: number, data: any) {
    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
