import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Subscription } from 'rxjs';
import { ChartData } from 'chart.js';
import { TradingService } from '@app/services/trading.service';
import { ChartDataService } from '@app/services/chart-data.service';

@Component({
  standalone: true,
  imports: [ChartModule, CardModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
})
export class BalanceComponent implements OnInit, OnDestroy {
  public data: ChartData | undefined;

  private subscription: Subscription = new Subscription();

  constructor(
    private tradingService: TradingService,
    private chartDataService: ChartDataService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.tradingService
        .getTrades()
        .subscribe(
          (data) => (this.data = this.chartDataService.getChartData(data))
        )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
