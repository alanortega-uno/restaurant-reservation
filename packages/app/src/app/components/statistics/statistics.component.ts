import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { Subject, takeUntil } from 'rxjs';
import { StatisticsService } from 'src/app/services/statistics.service';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent implements OnInit {
  options: EChartsOption = {
    legend: {},
    tooltip: {},
    dataset: {
      // Provide a set of data.
      source: [['day', 'total', 'fulfilled', 'cancelled']],
    },
    // Declare an x-axis (category axis).
    // The category map the first column in the dataset by default.
    xAxis: { type: 'category' },
    // Declare a y-axis (value axis).
    yAxis: {},
    // Declare several 'bar' series,
    // every series will auto-map to each column by default.
    series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }],
  };

  mergeOptions!: EChartsOption;

  dateRange: {
    start: string | null;
    end: string | null;
  } = {
    start: null,
    end: null,
  };

  private readonly destroy$ = new Subject<void>();

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {}

  RandomDataset() {
    this.mergeOptions = {
      dataset: {
        source: [
          ['product', '2015', '2016', '2017'],
          ['Matcha Latte', ...this.getRandomValues()],
          ['Milk Tea', ...this.getRandomValues()],
          ['Cheese Cocoa', ...this.getRandomValues()],
          ['Walnut Brownie', ...this.getRandomValues()],
        ],
      },
    };
  }

  private getRandomValues() {
    const res: number[] = [];
    for (let i = 0; i < 3; i++) {
      res.push(Math.random() * 100);
    }
    return res;
  }

  thisWeek() {
    this.statisticsService
      .getThisWeekReservationData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        console.log(response);

        this.mergeOptions = {
          dataset: {
            source: (response as any).matrix,
          },
        };
      });
  }

  thisMonth() {
    this.statisticsService
      .getThisMonthReservationData()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        console.log(response);

        this.mergeOptions = {
          dataset: {
            source: (response as any).matrix,
          },
        };
      });
  }

  customDateRange() {
    if (!this.dateRange.start || !this.dateRange.end) return;

    this.statisticsService
      .getCustomDateRangeReservationData(
        this.dateRange.start,
        this.dateRange.end
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        console.log(response);

        this.mergeOptions = {
          dataset: {
            source: (response as any).matrix,
          },
        };
      });
  }

  updateDateRange(dateRange: { start: string; end: string }) {
    console.log('updateDateRange', dateRange);
    this.dateRange = dateRange;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
