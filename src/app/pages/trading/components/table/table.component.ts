import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Trade } from '@app/interfaces/trade.interface';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input({ required: true })
  public trades!: Trade[];

  @Output()
  public onRowClick: EventEmitter<Trade> = new EventEmitter<Trade>();
  @Output()
  public onRowSelect: EventEmitter<Trade[]> = new EventEmitter<Trade[]>();

  private _selectedTrades: Trade[] = [];
  public get selectedTrades(): Trade[] {
    return this._selectedTrades;
  }

  @Input({ required: true })
  public set selectedTrades(value: Trade[]) {
    this._selectedTrades = value;
    this.onRowSelect.emit(value);
  }

  public rowClicked(trade: Trade): void {
    this.onRowClick.emit(trade);
  }

  public stopClickPropagation(event: Event): void {
    event.stopPropagation();
  }
}
