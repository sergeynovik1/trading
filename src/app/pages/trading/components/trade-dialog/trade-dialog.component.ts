import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { Subscription, filter, map, merge } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountService } from '@app/services/account.service';
import { entryPriceValidator } from '@app/validators/entry-price.validator';
import { exitDateValidator } from '@app/validators/exit-date.validator';
import { exitPriceValidator } from '@app/validators/exit-price.validator';

@Component({
  standalone: true,
  imports: [
    CalendarModule,
    InputNumberModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './trade-dialog.component.html',
  styleUrl: './trade-dialog.component.scss',
})
export class TradeDialogComponent implements OnInit, OnDestroy {
  public form: FormGroup | undefined;
  public todayDate: Date | undefined;
  private subscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.todayDate = new Date();
    this.form = this.fb.group({
      id: [this.config.data?.id],
      entryDate: [
        this.config.data?.entryDate ?? this.todayDate,
        [Validators.required],
      ],
      entryPrice: [
        this.config.data?.entryPrice,
        [Validators.required, entryPriceValidator(this.accountService)],
      ],
      exitDate: [
        this.config.data?.exitDate,
        [Validators.required, exitDateValidator()],
      ],
      exitPrice: [
        this.config.data?.exitPrice,
        [Validators.required, exitPriceValidator()],
      ],
      profit: [
        { value: this.config.data?.profit ?? 0, disabled: true },
        [Validators.required],
      ],
    });

    this.subscription.add(
      this.form.controls['entryPrice'].valueChanges.subscribe((entryPrice) => {
        if (entryPrice > this.form?.controls['exitPrice'].value) {
          this.form?.controls['exitPrice'].setValue(null);
          this.form?.controls['exitPrice'].markAsPristine();
        }
      })
    );

    this.subscription.add(
      merge(
        this.form.controls['entryPrice'].valueChanges,
        this.form.controls['exitPrice'].valueChanges
      )
        .pipe(
          map(() => ({
            entryPrice: this.form?.controls['entryPrice'].value,
            exitPrice: this.form?.controls['exitPrice'].value,
          })),
          filter((data) => data['entryPrice'] && data['exitPrice'])
        )
        .subscribe((data) => {
          data.exitPrice < data.entryPrice
            ? 0
            : this.form?.controls['profit'].setValue(
                data.exitPrice - data.entryPrice
              );
        })
    );
  }

  public submit(): void {
    this.ref.close({ ...this.form?.getRawValue() });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
