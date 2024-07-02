import { AppDataSource } from "../index";
import { ReservationEntity } from "../entities/reservation";
import { TableEntity } from "../entities/table";
import { ReservationStatus, TableStatus } from "../../../shared/index";
import { ServerError } from "../utils/server-error";
import { StatusCodes } from "http-status-codes";

export class ReservationService {
  static async createReservation(
    data: Partial<ReservationEntity>
  ): Promise<ReservationEntity> {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const table = await transactionalEntityManager.findOne(TableEntity, {
          where: { id: data.table?.id },
        });

        if (!table) {
          throw new Error("Table not found");
        }

        if (table.status !== TableStatus.available) {
          throw new Error("Table is not available");
        }

        table.status = TableStatus.reserved;
        await transactionalEntityManager.save(table);

        const reservation = transactionalEntityManager.create(
          ReservationEntity,
          data
        );
        return await transactionalEntityManager.save(reservation);
      }
    );
  }

  static async fulfillReservation(reservationId: number): Promise<void> {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const reservation = await transactionalEntityManager.findOne(
          ReservationEntity,
          {
            where: { id: reservationId },
            relations: ["table"], // Make sure to load the related table
          }
        );

        if (!reservation) {
          throw new Error("Reservation not found");
        }

        reservation.status = ReservationStatus.fulfilled;
        await transactionalEntityManager.save(reservation);

        const table = reservation.table;

        if (!table) {
          throw new Error("Table not found");
        }

        table.status = TableStatus.occupied;
        await transactionalEntityManager.save(table);
      }
    );
  }

  static async cancelReservation(
    reservationId: number
  ): Promise<ReservationEntity> {
    return await AppDataSource.transaction(
      async (transactionalEntityManager) => {
        const reservationRepository =
          transactionalEntityManager.getRepository(ReservationEntity);
        const reservation = await reservationRepository.findOne({
          where: { id: reservationId },
          relations: ["table"],
        });

        if (!reservation) {
          throw new Error("Reservation not found");
        }

        if (reservation.status === ReservationStatus.cancelled) {
          throw new Error("Reservation is already cancelled");
        }

        reservation.status = ReservationStatus.cancelled;

        if (reservation.table) {
          reservation.table.status = TableStatus.available;
          await transactionalEntityManager.save(reservation.table);
        }

        return await transactionalEntityManager.save(reservation);
      }
    );
  }

  static async getLastReservationByAccount(
    accountId: number
  ): Promise<ReservationEntity | null> {
    const reservationRepository =
      AppDataSource.getRepository(ReservationEntity);
    const lastReservation = await reservationRepository.findOne({
      where: { account: { id: accountId } },
      order: { created_at: "DESC" },
      relations: ["table", "account"],
    });

    return lastReservation;
  }

  static async getLastReservationByTable(
    tableId: number
  ): Promise<ReservationEntity | null> {
    const reservationRepository =
      AppDataSource.getRepository(ReservationEntity);
    const lastReservation = await reservationRepository.findOne({
      where: { table: { id: tableId } },
      order: { created_at: "DESC" },
      relations: ["table", "account"],
    });

    return lastReservation;
  }

  static async updateReservation(
    reservationId: number,
    name: string,
    phone: string,
    numberOfPeople: number
  ): Promise<ReservationEntity | null> {
    const reservationRepository =
      AppDataSource.getRepository(ReservationEntity);

    const reservation = await reservationRepository.findOne({
      where: { id: reservationId },
      loadRelationIds: true,
    });

    if (!reservation) {
      throw new ServerError(
        "There is no reservation for that ID",
        StatusCodes.BAD_REQUEST
      );
    }

    Object.assign(reservation, {
      name,
      phone,
      number_of_people: numberOfPeople,
    });

    reservation.save();

    return reservation;
  }
}
