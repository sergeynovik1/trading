import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'trading',
    loadComponent: () =>
      import('./pages/trading/trading.component').then(
        (m) => m.TradingComponent
      ),
  },
  {
    path: 'balance',
    loadComponent: () =>
      import('./pages/balance/balance.component').then(
        (m) => m.BalanceComponent
      ),
  },
  {
    path: '',
    redirectTo: 'trading',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
