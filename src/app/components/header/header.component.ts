import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { Account } from '@app/interfaces/account.interface';
import { AccountService } from '@app/services/account.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  public accountState: Observable<Account> | undefined;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountState = this.accountService.getAccountState();
  }
}
