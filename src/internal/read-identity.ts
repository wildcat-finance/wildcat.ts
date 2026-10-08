export class ReadIdentityMismatchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReadIdentityMismatchError";
  }
}

export function assertReadIdentity(condition: unknown, message: string): asserts condition {
  if (!condition) throw new ReadIdentityMismatchError(message);
}

export function assertMatchingAddress(actual: unknown, expected: unknown, context: string): void {
  assertReadIdentity(
    typeof actual === "string" &&
      typeof expected === "string" &&
      actual.toLowerCase() === expected.toLowerCase(),
    `${context} address mismatch`
  );
}
