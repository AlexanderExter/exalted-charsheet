/* eslint-disable no-console */

export function logError(...args: unknown[]): void {
  if (process.env.NODE_ENV === "development") {
    console.error(...args);
  }
}
