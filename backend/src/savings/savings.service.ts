import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SavingsGoalType } from '@prisma/client';

@Injectable()
export class SavingsService {
  constructor(private prisma: PrismaService) {}

  async getActiveGoal(userId: number) {
    return this.prisma.savingsGoal.findFirst({
      where: { userId, isActive: true },
    });
  }

  async createGoal(userId: number, data: { type: SavingsGoalType; amount: number }) {
    // Inactivate any existing goals for this user
    await this.prisma.savingsGoal.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });

    return this.prisma.savingsGoal.create({
      data: {
        userId,
        type: data.type,
        amount: data.amount,
        isActive: true,
      },
    });
  }

  async checkPendingDeposit(userId: number) {
    const goal = await this.getActiveGoal(userId);
    if (!goal) return { hasGoal: false, pendingDeposit: null };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (goal.type === 'DAILY') {
      const deposit = await this.prisma.savingsDeposit.findFirst({
        where: {
          goalId: goal.id,
          date: { gte: today },
        },
      });
      return { 
        hasGoal: true, 
        goal, 
        pendingDeposit: deposit ? null : goal.amount.toNumber()
      };
    } else { // WEEKLY
      const getMonday = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
        date.setDate(diff);
        date.setHours(0, 0, 0, 0);
        return date;
      };
      const weekStart = getMonday(new Date());

      const deposit = await this.prisma.savingsDeposit.findFirst({
        where: {
          goalId: goal.id,
          date: { gte: weekStart },
        },
      });
      return { 
        hasGoal: true, 
        goal, 
        pendingDeposit: deposit ? null : goal.amount.toNumber()
      };
    }
  }

  async getSavingsProgress(userId: number) {
    const goal = await this.getActiveGoal(userId);
    if (!goal) return { hasGoal: false };

    // Get all deposits for this active goal
    const deposits = await this.prisma.savingsDeposit.findMany({
      where: { goalId: goal.id },
      orderBy: { date: 'desc' },
      take: 10, // Get the last 10 deposits for history
    });

    // Sum all deposits for the active goal to get total saved
    const aggregate = await this.prisma.savingsDeposit.aggregate({
      where: { goalId: goal.id },
      _sum: { amount: true },
    });

    const totalSaved = aggregate._sum.amount?.toNumber() || 0;

    return {
      hasGoal: true,
      goalType: goal.type,
      goalAmount: goal.amount.toNumber(),
      totalSaved,
      history: deposits,
    };
  }

  async makeDeposit(userId: number) {
    const status = await this.checkPendingDeposit(userId);
    if (!status.hasGoal || !status.goal) {
      throw new BadRequestException('No active savings goal found');
    }
    if (status.pendingDeposit === null) {
      throw new BadRequestException('Deposit already made for this period');
    }

    // 1. Create a Personal Expense to discount from Net Profit
    // First, find or create the "Ahorro" category
    let category = await this.prisma.expenseCategory.findFirst({
      where: { name: 'Ahorro', type: 'PERSONAL' }
    });

    if (!category) {
      category = await this.prisma.expenseCategory.create({
        data: { name: 'Ahorro', type: 'PERSONAL' }
      });
    }

    const expense = await this.prisma.expense.create({
      data: {
        userId,
        amount: status.pendingDeposit,
        description: 'Depósito de meta de ahorro (' + (status.goal.type === 'DAILY' ? 'Diario' : 'Semanal') + ')',
        categoryId: category.id,
      }
    });

    // 2. Register the Savings Deposit
    const deposit = await this.prisma.savingsDeposit.create({
      data: {
        goalId: status.goal.id,
        amount: status.pendingDeposit,
        expenseId: expense.id,
      }
    });

    return { deposit, expense };
  }
}
