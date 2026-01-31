/**
 * Date extensions for ABP React
 * Adds toLocalISOString method to Date prototype
 * @since 1.1.0
 */

declare global {
  interface Date {
    /**
     * Returns the date as an ISO string in the local timezone.
     * Unlike toISOString() which always returns UTC, this method
     * returns the date/time adjusted for the local timezone offset.
     * @since 1.1.0
     */
    toLocalISOString(): string;
  }
}

// Add toLocalISOString to Date prototype if it doesn't exist
if (!Date.prototype.toLocalISOString) {
  Date.prototype.toLocalISOString = function (): string {
    const pad = (num: number): string => String(num).padStart(2, '0');

    const year = this.getFullYear();
    const month = pad(this.getMonth() + 1);
    const day = pad(this.getDate());
    const hours = pad(this.getHours());
    const minutes = pad(this.getMinutes());
    const seconds = pad(this.getSeconds());
    const milliseconds = String(this.getMilliseconds()).padStart(3, '0');

    // Get timezone offset in ±HH:MM format
    const tzOffset = -this.getTimezoneOffset();
    const tzSign = tzOffset >= 0 ? '+' : '-';
    const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
    const tzMinutes = pad(Math.abs(tzOffset) % 60);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${tzSign}${tzHours}:${tzMinutes}`;
  };
}

export {};
