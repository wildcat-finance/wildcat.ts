export function assert(condition: boolean, message: string, ...details: any[]): asserts condition {
  if (condition) {
    return;
  }

  for (let i = 0; i < details.length; i++) {
    const detail = details[i];
    const part = detail;

    message = message.replace(new RegExp("\\{" + i + "\\}", "g"), part);
  }

  throw new Error(message);
}
