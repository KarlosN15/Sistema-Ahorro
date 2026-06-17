import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboard(
    @CurrentUser() user: any,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    const m = month ? parseInt(month, 10) : new Date().getMonth() + 1;
    return this.reportsService.getDashboardSummary(user.userId, y, m);
  }

  @Get('weekly')
  getWeekly(@CurrentUser() user: any) {
    return this.reportsService.getWeeklyAnalytics(user.userId);
  }

  @Get('history')
  getHistory(@CurrentUser() user: any) {
    return this.reportsService.getHistory(user.userId);
  }

  @Get('ai-advice')
  async getAiAdvice(@CurrentUser() user: any) {
    const today = new Date();
    const dashboard = await this.reportsService.getDashboardSummary(user.userId, today.getFullYear(), today.getMonth() + 1);
    const weekly = await this.reportsService.getWeeklyAnalytics(user.userId);
    return this.reportsService.getAiAdvice(dashboard, weekly);
  }

  @Get('full-dashboard')
  getFullDashboard(
    @CurrentUser() user: any,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    const m = month ? parseInt(month, 10) : new Date().getMonth() + 1;
    return this.reportsService.getFullDashboard(user.userId, y, m);
  }
}
