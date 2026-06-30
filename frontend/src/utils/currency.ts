export function formatPrice(value: number | string | null | undefined): string {
  const amount = Number(value) || 0;
  const hasCents = !Number.isInteger(amount);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
