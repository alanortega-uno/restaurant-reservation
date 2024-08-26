import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDatepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { DatepickerRangePopupComponent } from './datepicker-range-popup.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DatepickerRangePopupComponent', () => {
  let component: DatepickerRangePopupComponent;
  let fixture: ComponentFixture<DatepickerRangePopupComponent>;
  let calendar: NgbCalendar;
  let formatter: NgbDateParserFormatter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatepickerRangePopupComponent],
      imports: [NgbDatepickerModule],
      providers: [
        {
          provide: NgbCalendar,
          useValue: {
            isValid: jasmine.createSpy('isValid').and.returnValue(true),
          },
        },
        {
          provide: NgbDateParserFormatter,
          useValue: {
            parse: jasmine.createSpy('parse').and.callFake((input: string) => {
              const [year, month, day] = input.split('-').map(Number);
              return new NgbDate(year, month, day);
            }),
            format: jasmine
              .createSpy('format')
              .and.callFake((date: NgbDate) => {
                return `${date?.year}-${date?.month}-${date?.day}`;
              }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerRangePopupComponent);
    component = fixture.componentInstance;
    calendar = TestBed.inject(NgbCalendar);
    formatter = TestBed.inject(NgbDateParserFormatter);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDateSelection', () => {
    it('should set fromDate if it is the first selection', () => {
      const date = new NgbDate(2023, 8, 20);
      component.onDateSelection(date);

      expect(component.fromDate).toEqual(date);
      expect(component.toDate).toBeNull();
    });

    it('should set toDate and emit rangeSelected if fromDate is already set and date is after fromDate', () => {
      const fromDate = new NgbDate(2023, 8, 20);
      const toDate = new NgbDate(2023, 8, 25);
      spyOn(component.rangeSelected, 'emit');

      component.onDateSelection(fromDate);
      component.onDateSelection(toDate);

      expect(component.toDate).toEqual(toDate);
      expect(component.rangeSelected.emit).toHaveBeenCalledWith({
        start: '2023-08-20',
        end: '2023-08-25',
      });
    });

    it('should reset toDate and set fromDate if a new date is selected', () => {
      const initialFromDate = new NgbDate(2023, 8, 20);
      const newFromDate = new NgbDate(2023, 8, 15);

      component.onDateSelection(initialFromDate);
      component.onDateSelection(newFromDate);

      expect(component.fromDate).toEqual(newFromDate);
      expect(component.toDate).toBeNull();
    });
  });

  describe('isHovered', () => {
    it('should return true if date is between fromDate and hoveredDate', () => {
      const fromDate = new NgbDate(2023, 8, 20);
      const hoveredDate = new NgbDate(2023, 8, 25);
      const date = new NgbDate(2023, 8, 23);

      component.fromDate = fromDate;
      component.hoveredDate = hoveredDate;

      expect(component.isHovered(date)).toBeTrue();
    });

    it('should return false if date is outside the range', () => {
      const fromDate = new NgbDate(2023, 8, 20);
      const hoveredDate = new NgbDate(2023, 8, 25);
      const date = new NgbDate(2023, 8, 19);

      component.fromDate = fromDate;
      component.hoveredDate = hoveredDate;

      expect(component.isHovered(date)).toBeFalse();
    });
  });

  describe('isInside', () => {
    it('should return true if date is between fromDate and toDate', () => {
      const fromDate = new NgbDate(2023, 8, 20);
      const toDate = new NgbDate(2023, 8, 25);
      const date = new NgbDate(2023, 8, 23);

      component.fromDate = fromDate;
      component.toDate = toDate;

      expect(component.isInside(date)).toBeTrue();
    });

    it('should return false if date is outside the range', () => {
      const fromDate = new NgbDate(2023, 8, 20);
      const toDate = new NgbDate(2023, 8, 25);
      const date = new NgbDate(2023, 8, 19);

      component.fromDate = fromDate;
      component.toDate = toDate;

      expect(component.isInside(date)).toBeFalse();
    });
  });

  describe('isRange', () => {
    it('should return true if date is fromDate, toDate, inside, or hovered', () => {
      const fromDate = new NgbDate(2023, 8, 20);
      const toDate = new NgbDate(2023, 8, 25);
      const insideDate = new NgbDate(2023, 8, 23);
      const hoveredDate = new NgbDate(2023, 8, 24);

      component.fromDate = fromDate;
      component.toDate = toDate;
      component.hoveredDate = hoveredDate;

      expect(component.isRange(fromDate)).toBeTrue();
      expect(component.isRange(toDate)).toBeTrue();
      expect(component.isRange(insideDate)).toBeTrue();
      expect(component.isRange(hoveredDate)).toBeTrue();
    });

    it('should return false if date is outside the range', () => {
      const fromDate = new NgbDate(2023, 8, 20);
      const toDate = new NgbDate(2023, 8, 25);
      const outsideDate = new NgbDate(2023, 8, 19);

      component.fromDate = fromDate;
      component.toDate = toDate;

      expect(component.isRange(outsideDate)).toBeFalse();
    });
  });

  describe('validateInput', () => {
    it('should return a valid NgbDate if the input is a valid date', () => {
      const input = '2023-08-20';
      const parsedDate = new NgbDate(2023, 8, 20);

      expect(component.validateInput(null, input)).toEqual(parsedDate);
    });
  });

  describe('ngbDateToString', () => {
    it('should format NgbDate to string in YYYY-MM-DD format', () => {
      const date = new NgbDate(2023, 8, 5);
      expect(component.ngbDateToString(date)).toEqual('2023-08-05');
    });
  });
});
