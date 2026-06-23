import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SavingsGoalType } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('savings')
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Get('status')
  async getStatus(@Request() req) {
    return this.savingsService.checkPendingDeposit(req.user.id);
  }

  @Post('goal')
  async createGoal(@Request() req, @Body() body: { type: SavingsGoalType; amount: number }) {
    return this.savingsService.createGoal(req.user.id, body);
  }

  @Post('deposit')
  async makeDeposit(@Request() req) {
    return this.savingsService.makeDeposit(req.user.id);
  }
}
