import { getAllAccounts, test } from "../../src/handlers/authentication";
import { mockRequest, mockResponse } from "../../__mocks__";

describe("getAccounts", () => {
  it("should return an array of accounts", () => {
    test(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalled();
  });

  // it("should return an array of accounts", () => {
  //   getAllAccounts(mockRequest, mockResponse);

  //   expect(mockResponse.json).toHaveBeenCalled();
  //   expect(mockResponse.status).toHaveBeenCalled();
  // });
});
