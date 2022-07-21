const pad = (n: number) => (n <= 9 ? `0${n}` : `${n}`);

export function msToMMSS(ms: number) {
  const seconds = Math.round(ms / 1000);
  const m = Math.trunc(seconds / 60);
  const s = seconds - m * 60;
  return `${pad(m)}:${pad(s)}`;
}
