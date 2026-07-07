export interface IErrorResponse {
  statusCode: number;
  success?: boolean;
  message: string;
  error: unknown;
}
