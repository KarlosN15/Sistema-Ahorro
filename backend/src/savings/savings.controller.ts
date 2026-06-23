import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SavingsGoalType } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Get('status')
  async getStatus(@CurrentUser() user: any) {
    return this.savingsService.checkPendingDeposit(user.userId);
  }

  @Post('goal')
  async createGoal(@CurrentUser() user: any, @Body() body: { type: SavingsGoalType; amount: number }) {
    return this.savingsService.createGoal(user.userId, body);
  }

  @Post('deposit')
  async makeDeposit(@CurrentUser() user: any) {
    return this.savingsService.makeDeposit(user.userId);
  }
}
