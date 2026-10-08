const numberFormatter = new Intl.NumberFormat("es-CR");

export function formatPrice(amount: number): string {
  return numberFormatter
    .formatToParts(amount)
    .map(({ type, value }) => (type === "group" ? " " : value))
    .join("");
}