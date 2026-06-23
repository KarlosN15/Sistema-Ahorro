import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { IncomesModule } from './incomes/incomes.module';
import { CategoriesModule } from './categories/categories.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ReportsModule } from './reports/reports.module';
import { SavingsModule } from './savings/savings.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule, 
    UsersModule, 
    ServicesModule, 
    IncomesModule, 
    CategoriesModule, 
    ExpensesModule, 
    ReportsModule,
    SavingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
