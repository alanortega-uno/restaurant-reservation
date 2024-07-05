import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-datepicker-range-popup',
  templateUrl: './datepicker-range-popup.component.html',
  styleUrls: ['./datepicker-range-popup.component.scss'],
})
export class DatepickerRangePopupComponent {
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  @Output() rangeSelected = new EventEmitter<{ start: string; end: string }>();

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = null;
    this.toDate = null;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
      this.rangeSelected.emit({
        start: this.ngbDateToString(this.fromDate),
        end: this.ngbDateToString(this.toDate),
      });
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed))
      ? NgbDate.from(parsed)
      : currentValue;
  }

  ngbDateToString(date: NgbDate) {
    const month = date.month.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    const day = date.day.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    return `${date.year}-${month}-${day}`;
  }
}
