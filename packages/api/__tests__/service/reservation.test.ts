import { ReservationService } from "../../src/services/reservation";
import { ReservationEntity } from "../../src/entities/reservation";
import { TableEntity } from "../../src/entities/table";
import { ReservationStatus, TableStatus } from "../../../shared/index";
import { AppDataSource } from "../../src/index";

jest.mock("../../src/index");

describe("ReservationService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createReservation", () => {
    it("should create a reservation successfully", async () => {
      const mockTable = new TableEntity();
      mockTable.id = 1;
      mockTable.status = TableStatus.available;

      const mockReservationData: Partial<ReservationEntity> = {
        table: mockTable,
        // Add other necessary fields
      };

      const mockEntityManager = {
        findOne: jest.fn().mockResolvedValue(mockTable),
        save: jest
          .fn()
          .mockResolvedValueOnce(mockTable)
          .mockResolvedValueOnce(mockReservationData as ReservationEntity),
        create: jest
          .fn()
          .mockReturnValue(mockReservationData as ReservationEntity),
      };

      (AppDataSource.transaction as jest.Mock).mockImplementation(
        async (callback: (entityManager: any) => Promise<any>) => {
          return await callback(mockEntityManager);
        }
      );

      const result = await ReservationService.createReservation(
        mockReservationData
      );

      expect(AppDataSource.transaction).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalledWith(mockTable);
      expect(mockEntityManager.save).toHaveBeenCalledWith(mockReservationData);
      expect(result).toEqual(mockReservationData as ReservationEntity);
    });
  });

  describe("fulfillReservation", () => {
    it("should fulfill a reservation successfully", async () => {
      const mockReservation = new ReservationEntity();
      mockReservation.id = 1;
      mockReservation.status = ReservationStatus.active;

      const mockTable = new TableEntity();
      mockTable.id = 1;
      mockTable.status = TableStatus.available;

      mockReservation.table = mockTable;

      const mockEntityManager = {
        findOne: jest.fn().mockResolvedValue(mockReservation),
        save: jest
          .fn()
          .mockResolvedValueOnce(mockReservation)
          .mockResolvedValueOnce(mockTable),
      };

      (AppDataSource.transaction as jest.Mock).mockImplementation(
        async (callback: (entityManager: any) => Promise<any>) => {
          return await callback(mockEntityManager);
        }
      );

      const result = await ReservationService.fulfillReservation(1);

      expect(AppDataSource.transaction).toHaveBeenCalled();
      expect(mockEntityManager.save).toHaveBeenCalledWith(mockReservation);
      expect(mockEntityManager.save).toHaveBeenCalledWith(mockTable);
      expect(result).toBeUndefined();
    });
  });
});
