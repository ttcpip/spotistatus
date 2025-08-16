const pad = (n: number) => (n <= 9 ? `0${n}` : `${n}`);

export function msToMMSS(ms: number) {
  // Convert milliseconds to seconds and avoid rounding up so that
  // 59.9s is represented as 00:59 instead of 01:00. Using Math.floor
  // ensures the time never exceeds the actual duration.
  const seconds = Math.floor(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}
