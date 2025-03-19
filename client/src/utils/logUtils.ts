/**
 * Formats a log message with the current date and time, and a 'freqsplit' prefix.
 * @param message - The log message to format.
 * @returns The formatted log message.
 */
export function formatLogMessage(message: string): string {
  const now = new Date();

  // Pad single-digit numbers with leading zeros
  const pad = (number: number, length = 2): string => number.toString().padStart(length, '0');

  // Extract date components
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1); // Months are zero-based
  const day = pad(now.getDate());

  // Extract time components
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const milliseconds = pad(now.getMilliseconds(), 3);

  // Construct the formatted date-time string
  const timestamp = `[${year}-${month}-${day} ${hours}:${minutes}:${seconds},${milliseconds}: freqsplit]`;

  // Return the combined log message
  return `${timestamp}: ${message}`;
}
