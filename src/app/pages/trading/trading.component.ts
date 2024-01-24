import { TradingService } from './../../services/trading.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TableComponent } from './components/table/table.component';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TradeDialogComponent } from './components/trade-dialog/trade-dialog.component';
import {
  Observable,
  Subscription,
  filter,
  forkJoin,
  switchMap,
  tap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Trade } from '@app/interfaces/trade.interface';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-trading',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ToolbarComponent,
    TableComponent,
    ButtonModule,
    DynamicDialogModule,
    ToastModule,
  ],
  providers: [DialogService, MessageService],
  templateUrl: './trading.component.html',
  styleUrl: './trading.component.scss',
})
export class TradingComponent implements OnInit, OnDestroy {
  public trades: Observable<Trade[]> | undefined;
  public selectedTrades: Trade[] | undefined;
  private subscription: Subscription = new Subscription();

  constructor(
    private dialogService: DialogService,
    private tradingService: TradingService,
    private messageService: MessageService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.trades = this.tradingService.getTrades();
    this.selectedTrades = [];
  }

  public onRowSelect(selectedTrades: Trade[]): void {
    this.selectedTrades = selectedTrades;
  }

  public openTradeDialog(trade?: Trade): void {
    this.subscription.add(
      this.dialogService
        .open(TradeDialogComponent, {
          header: 'Trade',
          data: trade,
          contentStyle: { overflow: 'visible', padding: '0px 20px 20px 20px' },
          width: '500px',
        })
        .onClose.pipe(filter((res) => !!res))
        .subscribe((res) =>
          trade ? this.updateTrade(res, trade) : this.addTrade(res)
        )
    );
  }

  public removeSelectedTrade(): void {
    this.subscription.add(
      forkJoin(
        (this.selectedTrades ?? []).map((selectedTrade) =>
          this.tradingService
            .deleteTrade(selectedTrade)
            .pipe(
              switchMap(() =>
                this.accountService.changeBalance(selectedTrade.entryPrice)
              )
            )
        )
      )
        .pipe(tap(() => this.showToast('success', 'Selected trades removed')))
        .subscribe(() => (this.selectedTrades = []))
    );
  }

  private addTrade(trade: Trade): void {
    this.subscription.add(
      this.tradingService
        .addTrade(trade)
        .pipe(
          switchMap(() => this.accountService.changeBalance(-trade.entryPrice))
        )
        .subscribe(() => this.showToast('success', 'Trade added successful'))
    );
  }

  public updateTrade(newTrade: Trade, lastTrade: Trade): void {
    this.subscription.add(
      this.tradingService
        .updateTrade(newTrade)
        .pipe(
          switchMap(() =>
            this.accountService.changeBalance(
              lastTrade.entryPrice - newTrade.entryPrice
            )
          )
        )
        .subscribe()
    );
  }

  private showToast(
    severity: 'success' | 'error' | 'info',
    message: string
  ): void {
    this.messageService.add({
      severity: severity,
      summary: 'Trade',
      detail: message,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
