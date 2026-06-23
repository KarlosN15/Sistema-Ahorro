import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary(userId: number, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const incomes = await this.prisma.income.aggregate({
      where: { userId, date: { gte: startDate, lte: endDate } },
      _sum: { amount: true },
    });

    const expenses = await this.prisma.expense.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
      include: { category: true },
    });

    let businessExpenses = 0;
    let personalExpenses = 0;

    expenses.forEach(exp => {
      if (exp.category.type === 'BUSINESS') {
        businessExpenses += exp.amount;
      } else if (exp.category.type === 'PERSONAL') {
        personalExpenses += exp.amount;
      }
    });

    const totalIncome = incomes._sum.amount || 0;
    const netProfit = totalIncome - businessExpenses;

    return {
      totalIncome,
      businessExpenses,
      personalExpenses,
      netProfit,
    };
  }

  async getWeeklyAnalytics(userId: number) {
    const today = new Date();
    
    const getMonday = (d: Date) => {
      const date = new Date(d);
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
      date.setDate(diff);
      date.setHours(0, 0, 0, 0);
      return date;
    };

    const currentWeekStart = getMonday(today);
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
    currentWeekEnd.setHours(23, 59, 59, 999);

    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekEnd = new Date(currentWeekStart);
    prevWeekEnd.setDate(prevWeekEnd.getDate() - 1);
    prevWeekEnd.setHours(23, 59, 59, 999);

    const currentIncomes = await this.prisma.income.findMany({
      where: { userId, date: { gte: currentWeekStart, lte: currentWeekEnd } }
    });
    
    const currentExpenses = await this.prisma.expense.findMany({
      where: { userId, date: { gte: currentWeekStart, lte: currentWeekEnd } },
      include: { category: true }
    });

    const currentClients = currentIncomes.length;
    const currentIncomeTotal = currentIncomes.reduce((acc, curr) => acc + curr.amount, 0);
    const currentBusinessExpenses = currentExpenses
      .filter(e => e.category.type === 'BUSINESS')
      .reduce((acc, curr) => acc + curr.amount, 0);
    const currentNetProfit = currentIncomeTotal - currentBusinessExpenses;

    const prevIncomes = await this.prisma.income.findMany({
      where: { userId, date: { gte: prevWeekStart, lte: prevWeekEnd } }
    });
    const prevClients = prevIncomes.length;

    const clientsDifference = currentClients - prevClients;
    const clientsTrend = clientsDifference >= 0 ? 'up' : 'down';
    
    const suggestedSavings = currentNetProfit > 0 ? currentNetProfit * 0.20 : 0;

    return {
      currentClients,
      prevClients,
      clientsDifference,
      clientsTrend,
      currentNetProfit,
      suggestedSavings
    };
  }

  async getHistory(userId: number) {
    const incomes = await this.prisma.income.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });
    
    const expenses = await this.prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { date: 'desc' }
    });

    const historyMap = new Map<string, any>();

    const getDayKey = (d: Date) => {
      const date = new Date(d);
      return date.toISOString().split('T')[0];
    };

    incomes.forEach(inc => {
      const key = getDayKey(inc.date);
      if (!historyMap.has(key)) {
        historyMap.set(key, { dayStart: key, clients: 0, totalIncome: 0, businessExpenses: 0 });
      }
      const data = historyMap.get(key);
      data.clients += 1;
      data.totalIncome += inc.amount;
    });

    expenses.forEach(exp => {
      if (exp.category.type !== 'BUSINESS') return;
      const key = getDayKey(exp.date);
      if (!historyMap.has(key)) {
        historyMap.set(key, { dayStart: key, clients: 0, totalIncome: 0, businessExpenses: 0 });
      }
      const data = historyMap.get(key);
      data.businessExpenses += exp.amount;
    });

    const historyList = Array.from(historyMap.values()).map(h => ({
      ...h,
      netProfit: h.totalIncome - h.businessExpenses
    }));

    historyList.sort((a, b) => new Date(b.dayStart).getTime() - new Date(a.dayStart).getTime());

    return historyList;
  }

  async getFullDashboard(userId: number, year: number, month: number) {
    const dashboard = await this.getDashboardSummary(userId, year, month);
    const weekly = await this.getWeeklyAnalytics(userId);
    const aiAdvice = this.getAiAdvice(dashboard, weekly);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayClients = await this.prisma.income.count({
      where: {
        userId,
        date: {
          gte: today,
          lt: tomorrow,
        }
      }
    });

    return {
      dashboard,
      weekly,
      aiAdvice,
      todayClients
    };
  }

  getAiAdvice(monthlyData: any, weeklyData: any) {
    const adviceList: Array<{ type: 'success' | 'warning' | 'danger' | 'info', message: string }> = [];

    const personalRatio = monthlyData.totalIncome > 0 ? (monthlyData.personalExpenses / monthlyData.totalIncome) : 0;
    if (personalRatio > 0.4) {
      adviceList.push({ type: 'danger', message: `Tus gastos personales representan el ${(personalRatio * 100).toFixed(0)}% de tus ingresos este mes. ¡Cuidado! Intenta mantenerlo bajo el 30% para no descapitalizar el negocio.` });
    } else if (personalRatio > 0 && personalRatio <= 0.3) {
      adviceList.push({ type: 'success', message: `Gastos personales en ${(personalRatio * 100).toFixed(0)}%. ¡Excelente disciplina financiera!` });
    }

    const businessRatio = monthlyData.totalIncome > 0 ? (monthlyData.businessExpenses / monthlyData.totalIncome) : 0;
    if (businessRatio > 0.6) {
      adviceList.push({ type: 'warning', message: `Tus gastos de negocio (${(businessRatio * 100).toFixed(0)}%) están muy altos. Revisa si puedes comprar insumos más baratos o reducir costos fijos.` });
    }

    if (weeklyData.clientsTrend === 'down' && Math.abs(weeklyData.clientsDifference) >= 3) {
      adviceList.push({ type: 'warning', message: `Has atendido ${Math.abs(weeklyData.clientsDifference)} clientes menos que la semana pasada. ¡Es un buen momento para escribirles a clientes antiguos y ofrecerles un retoque!` });
    }

    if (monthlyData.netProfit < 0) {
      adviceList.push({ type: 'danger', message: 'Alerta Crítica: Estás operando con pérdidas este mes. Frena cualquier gasto no esencial de inmediato.' });
    } else if (monthlyData.netProfit > 0 && adviceList.length === 0) {
      adviceList.push({ type: 'success', message: 'Finanzas muy saludables. Sigue manteniendo este ritmo y no olvides separar tu cuota para ahorros.' });
    }

    if (adviceList.length === 0) {
      adviceList.push({ type: 'info', message: 'Todavía no hay suficientes datos anómalos. Sigue registrando tus recortes.' });
    }

    return adviceList;
  }
}
