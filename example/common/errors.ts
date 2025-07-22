export class LineError extends Error {
  public userInfo?: {
    message: string
    statusCode: number
  }

  constructor(message: string) {
    super(message)
  }
}
