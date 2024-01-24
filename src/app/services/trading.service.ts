import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Trade } from '@app/interfaces/trade.interface';

@Injectable({ providedIn: 'root' })
export class TradingService {
  private trades: BehaviorSubject<Trade[]> = new BehaviorSubject<Trade[]>([]);

  constructor() {}

  public getTrades(): Observable<Trade[]> {
    return this.trades.asObservable();
  }

  public addTrade(trade: Trade): Observable<Trade[]> {
    this.trades.next([...this.trades.value, { ...trade, id: uuidv4() }]);
    return of(this.trades.value);
  }

  public updateTrade(trade: Trade): Observable<Trade> {
    this.trades.next(
      this.trades.getValue().map((t) => (t.id === trade.id ? trade : t))
    );
    return of(trade);
  }

  public deleteTrade(trade: Trade): Observable<Trade> {
    this.trades.next(this.trades.getValue().filter((t) => t.id !== trade.id));
    return of(trade);
  }
}
