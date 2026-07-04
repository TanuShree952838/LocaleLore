import type { Currency } from "@/lib/types";

/** Locale-aware currency formatting; Intl provides correct symbols (₹, $, ...). */
export function formatMoney(amount: number, currency: Currency): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0, // travel plans are easier to read with whole currency amounts
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount)}`;
  }
}

/** Formats minutes as a compact human duration, e.g. 75 -> "1h 15m". */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
