import { Injectable } from '@angular/core';
import { Account } from '@app/interfaces/account.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly INITIAL_BALANCE = 500;
  private accountState: BehaviorSubject<Account> = new BehaviorSubject<Account>(
    {
      actualBalance: this.INITIAL_BALANCE,
    }
  );

  constructor() {}

  public getInitialBalance(): number {
    return this.INITIAL_BALANCE;
  }

  public getAccountState(): Observable<Account> {
    return this.accountState.asObservable();
  }

  public getActualBalance(): number {
    return this.accountState.value.actualBalance;
  }

  public changeBalance(value: number): Observable<void> {
    return of(
      this.accountState.next({
        ...this.accountState.value,
        actualBalance: this.accountState.value.actualBalance + value,
      })
    );
  }
}
