import { Injectable } from '@angular/core';
import { BalancePerDay } from '@app/interfaces/balance-per-day.interface';
import { ProfitPerDay } from '@app/interfaces/profit-per-day.interface';
import { Trade } from '@app/interfaces/trade.interface';
import { ChartData } from 'chart.js';
import * as moment from 'moment';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class ChartDataService {
  constructor(private accountService: AccountService) {}

  public getChartData(data: Trade[]): ChartData {
    const labels: string[] = this.getSortedUniqueDates(data);

    const profitPerDay: { [key: string]: number } = this.calculateProfitPerDay(
      data,
      labels
    );

    const profitPerDayArray: ProfitPerDay[] =
      this.convertToProfitPerDayArray(profitPerDay);

    const balancePerDay: BalancePerDay[] =
      this.calculateBalancePerDay(profitPerDayArray);

    return this.createChartData(labels, balancePerDay);
  }

  private getSortedUniqueDates(data: Trade[]): string[] {
    return [
      ...new Set(
        data
          .map((item) => item.exitDate)
          .sort((a, b) => moment(a).valueOf() - moment(b).valueOf())
          .map((date) => moment(date).format('YYYY-MM-DD'))
      ),
    ];
  }

  private calculateProfitPerDay(
    data: Trade[],
    labels: string[]
  ): { [key: string]: number } {
    const profitPerDay: { [key: string]: number } = labels.reduce(
      (acc, date) => {
        return {
          [date]: 0,
          ...acc,
        };
      },
      {}
    );

    data.forEach((item) => {
      profitPerDay[moment(item.exitDate).format('YYYY-MM-DD')] += item.profit;
    });

    return profitPerDay;
  }

  private convertToProfitPerDayArray(profitPerDay: {
    [key: string]: number;
  }): ProfitPerDay[] {
    return Object.entries(profitPerDay)
      .map(([date, profit]) => ({
        date,
        profit: profit,
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
