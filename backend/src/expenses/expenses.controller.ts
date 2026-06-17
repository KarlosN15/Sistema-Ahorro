import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createDto: CreateExpenseDto, @CurrentUser() user: any) {
    return this.expensesService.create(user.userId, createDto);
  }

  @Get()
  findAll(@CurrentUser() user: any) {
    return this.expensesService.findAll(user.userId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any, @CurrentUser() user: any) {
    return this.expensesService.update(+id, user.userId, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.expensesService.remove(+id, user.userId);
  }
}
