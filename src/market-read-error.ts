/** A market read and its compatibility fallback both failed. */
export class MarketReadError extends Error {
  constructor(
    message: string,
    public readonly cause: unknown,
    public readonly fallbackError: unknown
  ) {
    super(message);
    this.name = "MarketReadError";
  }
}
