import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/income.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('incomes')
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @Post()
  create(@Body() createDto: CreateIncomeDto, @CurrentUser() user: any) {
    return this.incomesService.create(user.userId, createDto);
  }

  @Get()
  findAll(
    @CurrentUser() user: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : undefined;
    return this.incomesService.findAll(user.userId, pageNumber, limitNumber);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: any, @CurrentUser() user: any) {
    return this.incomesService.update(+id, user.userId, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.incomesService.remove(+id, user.userId);
  }
}
