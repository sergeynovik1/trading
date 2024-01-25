import { Injectable, Type } from '@angular/core';
import { BalancePerDay } from '@app/interfaces/balance-per-day.interface';
import { ProfitPerDay } from '@app/interfaces/profit-per-day.interface';
import { Trade } from '@app/interfaces/trade.interface';
import { ChartData } from 'chart.js';
import * as moment from 'moment';
import { AccountService } from '@app/services/account.service';

@Injectable({ providedIn: 'root' })
export class ChartDataService {
  constructor(private accountService: AccountService) {}

  public getChartData(trades: Trade[]): ChartData {
    const labels: string[] = this.getSortedUniqueDates(trades);

    const profitPerDayArray: ProfitPerDay[] =
      this.calculateProfitPerDay(trades);

    const balancePerDay: BalancePerDay[] =
      this.calculateBalancePerDay(profitPerDayArray);

    return this.createChartData(labels, balancePerDay);
  }

  private getSortedUniqueDates(data: Trade[]): string[] {
    return [
      ...new Set(
        data
          .map((item) => moment(item.exitDate).format('YYYY-MM-DD'))
          .sort((a, b) => moment(a).valueOf() - moment(b).valueOf())
      ),
    ];
  }

  private calculateProfitPerDay(trades: Trade[]): ProfitPerDay[] {
    return Object.entries(
      trades.reduce((acc, trade) => {
        const exitDate = moment(trade.exitDate).format('YYYY-MM-DD');
        return {
          ...acc,
          [exitDate]: (acc[exitDate] ?? 0) + trade.profit,
        };
      }, {} as Record<string, number>)
    )
      .map(([date, profit]) => ({
        date,
        profit,
      }))
      .sort((a, b) => moment(a.date).valueOf() - moment(b.date).valueOf());
  }

  private calculateBalancePerDay(
    profitPerDayArray: ProfitPerDay[]
  ): BalancePerDay[] {
    const initialBalance = this.accountService.getInitialBalance();

    return profitPerDayArray.reduce(
      (accumulator, profitPerDay) => {
        const currentBalance =
          accumulator.length > 0
            ? accumulator[accumulator.length - 1].balance
            : initialBalance;
        const balance = currentBalance + profitPerDay.profit;
        accumulator.push({ date: profitPerDay.date, balance });
        return accumulator;
      },
      [
        {
          date: moment().format('YYYY-MM-DD'),
          balance: initialBalance,
        },
      ]
    );
  }

  private createChartData(
    labels: string[],
    balancePerDay: BalancePerDay[]
  ): ChartData {
    return {
      labels: [moment().format('YYYY-MM-DD'), ...labels],
      datasets: [
        {
          label: 'Balance',
          data: balancePerDay.map((item) => item.balance),
          fill: false,
          tension: 0.4,
        },
      ],
    };
  }
}
