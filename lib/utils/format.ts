const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "4 Oct 2026". Fixed locale and time zone so server and client render identically. */
export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

/** "01", "02" … for sequence markers. */
export function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}
