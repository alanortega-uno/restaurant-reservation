import { AppDataSource } from "../index";
import { ReservationEntity } from "../entities/reservation";
import { ReservationStatus } from "../../../shared/enums/reservation-status";

const getStartOfWeek = (date: Date): Date => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  start.setDate(diff);
  return start;
};

const getEndOfWeek = (date: Date): Date => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  const day = end.getDay();
  const diff = end.getDate() - day + (day === 0 ? 0 : 7); // Adjust when day is not Sunday
  end.setDate(diff);
  return end;
};

export const getThisWeekReservationCounts = async () => {
  const startDate = getStartOfWeek(new Date());
  const endDate = getEndOfWeek(new Date());
  const reservationRepository = AppDataSource.getRepository(ReservationEntity);

  const result = await reservationRepository
    .createQueryBuilder("reservation")
    .select("DATE(reservation.created_at)", "date")
    .addSelect("reservation.status", "status")
    .addSelect("COUNT(*)", "count")
    .where("reservation.created_at BETWEEN :startDate AND :endDate", {
      startDate,
      endDate,
    })
    .groupBy("DATE(reservation.created_at)")
    .addGroupBy("reservation.status")
    .getRawMany();

  const counts = {};

  // Initialize the counts object with all days in the range
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr: string = currentDate.toISOString().split("T")[0];

    counts[dateStr as keyof Object] = {
      cancelled: 0,
      active: 0,
      fulfilled: 0,
    } as any;

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Populate the counts object with actual data from the query result
  for (const row of result) {
    const dateStr = row.date.toISOString().split("T")[0];
    const status = row.status;

    let statusKey = "cancelled";
    switch (status) {
      case "1":
        statusKey = "active";
        break;
      case "2":
        statusKey = "fulfilled";
        break;
    }
    const count = parseInt(row.count, 10);
    counts[dateStr as keyof Object][statusKey as keyof Object] = count as any;
  }

  return counts;
};

export const getThisMonthReservationCountsGroupedByWeek = async () => {
  const repository = AppDataSource.getRepository(ReservationEntity);

  // Calculate start and end dates for the current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Note: JavaScript months are 0-indexed (January is 0)
  const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the month
  const startDate = new Date(year, month - 1, 1); // Start of the month
  const endDate = new Date(year, month - 1, daysInMonth); // End of the month

  // Query to get weekly counts grouped by week within the month
  const result = await repository
    .createQueryBuilder("reservation")
    .select("WEEK(reservation.created_at, 1) AS week_number")
    .addSelect("YEAR(reservation.created_at) AS year")
    .addSelect("COUNT(*) AS total")
    .addSelect(
      `SUM(CASE WHEN reservation.status = '${ReservationStatus.cancelled}' THEN 1 ELSE 0 END) AS cancelled`
    )
    .addSelect(
      `SUM(CASE WHEN reservation.status = '${ReservationStatus.fulfilled}' THEN 1 ELSE 0 END) AS fulfilled`
    )
    .where(
      "reservation.created_at >= :startDate AND reservation.created_at <= :endDate",
      { startDate, endDate }
    )
    .groupBy("year, week_number")
    .orderBy("year, week_number", "ASC")
    .getRawMany();

  // Process the result to group by week and convert to a more structured format
  const groupedResult = result.reduce((acc, curr) => {
    const { year, week_number, total, cancelled, fulfilled } = curr;
    const weekStart = new Date(year, 0, (week_number - 1) * 7 + 1); // Calculate the start date of the week
    const weekEnd = new Date(year, 0, week_number * 7); // Calculate the end date of the week
    const weekKey = `${weekStart.toISOString().split("T")[0]} to ${
      weekEnd.toISOString().split("T")[0]
    }`;

    if (!acc[weekKey]) {
      acc[weekKey] = { total: 0, cancelled: 0, fulfilled: 0 };
    }

    acc[weekKey].total += parseInt(total, 10);
    acc[weekKey].cancelled += parseInt(cancelled, 10);
    acc[weekKey].fulfilled += parseInt(fulfilled, 10);

    return acc;
  }, {});

  return groupedResult;
};

export const getReservationCountsGroupedByCustomRange = async (
  startDate: string,
  endDate: string
): Promise<any> => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const result: any = {};

  let groupBy: string;

  if (diffInDays < 7) {
    groupBy = "DATE(created_at)";
  } else if (diffInDays < 30) {
    groupBy = "WEEK(created_at)";
  } else {
    groupBy = "MONTH(created_at)";
  }

  const query = `
    SELECT
      ${groupBy} as period,
      YEAR(created_at) as year,
      COUNT(*) as total,
      SUM(CASE WHEN status = '${ReservationStatus.cancelled}' THEN 1 ELSE 0 END) as cancelled,
      SUM(CASE WHEN status = '${ReservationStatus.fulfilled}' THEN 1 ELSE 0 END) as fulfilled
    FROM reservation
    WHERE created_at BETWEEN ? AND ?
    GROUP BY period, year
    ORDER BY period;
  `;

  const rawResult = await AppDataSource.query(query, [startDate, endDate]);

  for (const row of rawResult) {
    let periodLabel: string = "";

    if (diffInDays < 7) {
      periodLabel = new Date(row.period).toISOString().split("T")[0];
    } else if (diffInDays < 30) {
      const week = row.period;
      const startOfWeek = new Date(
        Number(row.year),
        0,
        (Number(week) - 1) * 7 + 1
      );
      const endOfWeek = new Date(
        Number(row.year),
        0,
        (Number(week) - 1) * 7 + 7
      );
      periodLabel = `${startOfWeek.toISOString().split("T")[0]} to ${
        endOfWeek.toISOString().split("T")[0]
      }`;
    } else {
      const month = row.period;
      const monthInt = Number(month);
      const startOfMonth = new Date(Number(row.year), monthInt - 1, 1);
      const endOfMonth = new Date(Number(row.year), monthInt, 0);
      periodLabel = `${startOfMonth.toISOString().split("T")[0]} to ${
        endOfMonth.toISOString().split("T")[0]
      }`;
    }

    result[periodLabel] = {
      total: row.total,
      cancelled: row.cancelled,
      fulfilled: row.fulfilled,
    };
  }

  return { result, rawResult };
};
