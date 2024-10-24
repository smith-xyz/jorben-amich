import { StatusCodes } from 'http-status-codes';

interface IServiceError {
  status: StatusCodes;
  errorId: string;
  errorCode: string;
  errorDescription: string;
}

export class ServiceError implements IServiceError {
  status: StatusCodes;
  errorId: string;
  errorCode: string;
  errorDescription: string;

  constructor(error: IServiceError) {
    this.status = error.status;
    this.errorId = error.errorId;
    this.errorCode = error.errorCode;
    this.errorDescription = error.errorDescription;
  }

  public get responseBody() {
    return {
      errorId: this.errorId,
      errorCode: this.errorCode,
      errorDescription: this.errorDescription,
    };
  }
}
