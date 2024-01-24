import { Component, OnDestroy, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
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
import { ToolbarComponent } from '@app/pages/trading/components/toolbar/toolbar.component';
import { TableComponent } from '@app/pages/trading/components/table/table.component';
import { TradingService } from '@app/services/trading.service';
import { TradeDialogComponent } from '@app/pages/trading/components/trade-dialog/trade-dialog.component';

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
        .onClose.pipe(
          filter((res) => !!res),
          switchMap((res) =>
            trade ? this.updateTrade(res, trade) : this.addTrade(res)
          )
        )
        .subscribe()
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

  private addTrade(trade: Trade): Observable<void> {
    return this.tradingService.addTrade(trade).pipe(
      switchMap(() => this.accountService.changeBalance(-trade.entryPrice)),
      tap(() => this.showToast('success', 'Trade added successful'))
    );
  }

  public updateTrade(newTrade: Trade, lastTrade: Trade): Observable<void> {
    return this.tradingService.updateTrade(newTrade).pipe(
      switchMap(() =>
        this.accountService.changeBalance(
          lastTrade.entryPrice - newTrade.entryPrice
        )
      ),
      tap(() => this.showToast('success', 'Trade updated successful'))
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
