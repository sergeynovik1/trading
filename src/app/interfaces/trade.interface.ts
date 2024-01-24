import * as moment from 'moment';

export interface Trade {
  id?: string;
  entryDate: moment.Moment;
  entryPrice: number;
  exitDate: moment.Moment;
  exitPrice: number;
  profit: number;
}
