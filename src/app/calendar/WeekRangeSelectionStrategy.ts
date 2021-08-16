import {Component, Injectable} from '@angular/core';
import {DateAdapter} from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';

@Injectable()
export class WeekRangeSelectionStrategy<D> implements MatDateRangeSelectionStrategy<D> {
  constructor(private _dateAdapter: DateAdapter<D>) {}

  selectionFinished(date: D | null): DateRange<D> {
    return this._createWeekRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createWeekRange(activeDate);
  }

  private _createWeekRange(date: Date| D | null): DateRange<D> {
    if (date) {
      let d=new Date(<Date>date);
      let s=d.getDay();
      const start = this._dateAdapter.addCalendarDays(<D>date, -s);
      const end = this._dateAdapter.addCalendarDays(start, 6);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}