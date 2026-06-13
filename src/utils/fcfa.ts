export function fcfa(n: number, { sign = false }: { sign?: boolean } = {}): string {
  const abs = Math.abs(n);
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
  const s = sign && n > 0 ? "+" : n < 0 ? "−" : "";
  return `${s}${formatted}\u202FF`;
}
