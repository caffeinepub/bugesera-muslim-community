import { Currency } from "../backend.d";
import { CURRENCY_SYMBOLS, EXCHANGE_RATES } from "../data/sampleData";

export function formatAmount(rwfAmount: number, currency: Currency): string {
  const rate = EXCHANGE_RATES[currency];
  const converted = currency === Currency.RWF ? rwfAmount : rwfAmount / rate;
  const symbol = CURRENCY_SYMBOLS[currency];
  return `${Math.round(converted).toLocaleString()} ${symbol}`;
}

export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatDateShort(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });
}
