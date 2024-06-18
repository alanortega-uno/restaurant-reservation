export interface APIError {
  error: any;
  statusCode: number;
}

export interface ApiError extends Error {
  statusCode: number;
}
