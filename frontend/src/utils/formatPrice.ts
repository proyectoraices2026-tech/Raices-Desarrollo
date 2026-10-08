const numberFormatter = new Intl.NumberFormat("es-CR");

/* Formatea un monto con separador de miles al estilo costarricense (espacio,
   no coma): 1000 -> "1 000". Se usa junto al símbolo ₡ en todo el sitio. */
export function formatPrice(amount: number): string {
  return numberFormatter
    .formatToParts(amount)
    .map(({ type, value }) => (type === "group" ? " " : value))
    .join("");
}
