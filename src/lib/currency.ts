export type CurrencyCode = 'ZAR' | 'USD' | 'EUR' | 'GBP' | 'NGN';

export const SUPPORTED_CURRENCIES: ReadonlyArray<CurrencyCode> = ['ZAR', 'USD', 'EUR', 'GBP', 'NGN'];

export function getDefaultCurrency(): CurrencyCode {
  return 'ZAR';
}

export function normalizeCurrency(input?: string | null): CurrencyCode | null {
  if (!input) return null;
  const upper = input.toUpperCase();
  return (SUPPORTED_CURRENCIES as ReadonlyArray<string>).includes(upper) ? (upper as CurrencyCode) : null;
}

export function formatMoney(amountMinor: number, currency: CurrencyCode) {
  const amountMajor = amountMinor / 100;
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(amountMajor);
}
