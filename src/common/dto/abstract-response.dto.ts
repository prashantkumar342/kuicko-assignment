export class AbstractResponse<T> {
  status: boolean;
  message: string;
  data: T | null;

  static success<T>(data: T, message = 'Success'): AbstractResponse<T> {
    return {
      status: true,
      message,
      data,
    };
  }
}
