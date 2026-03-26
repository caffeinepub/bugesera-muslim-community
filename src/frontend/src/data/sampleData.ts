import {
  AnnouncementCategory,
  ContributionCategory,
  Currency,
  PaymentMethod,
} from "../backend.d";

const NOW = BigInt(Date.now()) * 1_000_000n;

export const SAMPLE_CONTRIBUTIONS = [
  {
    id: 1n,
    donorName: "Uwimana Abubakar",
    amount: 50000,
    currency: Currency.RWF,
    category: ContributionCategory.Irayidi,
    paymentMethod: PaymentMethod.MTN,
    timestamp: NOW,
    note: "",
  },
  {
    id: 2n,
    donorName: "Habimana Ismail",
    amount: 75000,
    currency: Currency.RWF,
    category: ContributionCategory.Irayidi,
    paymentMethod: PaymentMethod.Airtel,
    timestamp: NOW,
    note: "",
  },
  {
    id: 3n,
    donorName: "Mukamana Fatuma",
    amount: 30000,
    currency: Currency.RWF,
    category: ContributionCategory.Irayidi,
    paymentMethod: PaymentMethod.Bank,
    timestamp: NOW,
    note: "",
  },
  {
    id: 4n,
    donorName: "Nzabonimana Yusuf",
    amount: 10000,
    currency: Currency.RWF,
    category: ContributionCategory.ZakatulFitr,
    paymentMethod: PaymentMethod.MTN,
    timestamp: NOW,
    note: "",
  },
  {
    id: 5n,
    donorName: "Bizimana Omar",
    amount: 10000,
    currency: Currency.RWF,
    category: ContributionCategory.ZakatulFitr,
    paymentMethod: PaymentMethod.MTN,
    timestamp: NOW,
    note: "",
  },
  {
    id: 6n,
    donorName: "Mukandayisenga Khadija",
    amount: 10000,
    currency: Currency.RWF,
    category: ContributionCategory.ZakatulFitr,
    paymentMethod: PaymentMethod.Airtel,
    timestamp: NOW,
    note: "",
  },
  {
    id: 7n,
    donorName: "Habiyambere Ibrahim",
    amount: 100000,
    currency: Currency.RWF,
    category: ContributionCategory.Musabaka,
    paymentMethod: PaymentMethod.Bank,
    timestamp: NOW,
    note: "",
  },
  {
    id: 8n,
    donorName: "Ndayisaba Hassan",
    amount: 80000,
    currency: Currency.RWF,
    category: ContributionCategory.Musabaka,
    paymentMethod: PaymentMethod.MTN,
    timestamp: NOW,
    note: "",
  },
  {
    id: 9n,
    donorName: "Uwizeyimana Amina",
    amount: 60000,
    currency: Currency.RWF,
    category: ContributionCategory.Musabaka,
    paymentMethod: PaymentMethod.Airtel,
    timestamp: NOW,
    note: "",
  },
];

export const SAMPLE_ANNOUNCEMENTS = [
  {
    id: 1n,
    title: "Juma Prayer Time Change – Effective This Week",
    body: "Muryango wa Bugesera Muslim Community muragezweho ko igihe cya Juma cyahinduwe. Ubu ni saa sita n'igice y'amanywa. Mwimenyeshe abandi.",
    category: AnnouncementCategory.urgent,
    date: BigInt(new Date("2026-03-20").getTime()) * 1_000_000n,
    pinned: true,
  },
  {
    id: 2n,
    title: "Annual Ramadan Iftaar Gathering – March 28th",
    body: "Turabatumira muri iftaar ya buri mwaka itegurirwa ku ya 28 Werurwe 2026 i Rwamagana. Mwize kuza n'umuryango wanyu wose. Haza abavugizi b'inzobere.",
    category: AnnouncementCategory.event,
    date: BigInt(new Date("2026-03-15").getTime()) * 1_000_000n,
    pinned: false,
  },
  {
    id: 3n,
    title: "Zakatul Fitr Collection Now Open",
    body: "Gutanga Zakatul Fitr bishoboka ubu binyuze muri app cyangwa usibye ku mafaranga. Ingano y'umuntu umwe ni 10,000 RWF. Ntimurengere igihe.",
    category: AnnouncementCategory.general,
    date: BigInt(new Date("2026-03-10").getTime()) * 1_000_000n,
    pinned: false,
  },
];

export const SAMPLE_MEETINGS = [
  {
    id: 1n,
    title: "Monthly Leadership Committee Meeting",
    date: BigInt(new Date("2026-04-05").getTime()) * 1_000_000n,
    location: "Bugesera Islamic Center, Nyamata",
    agenda:
      "1. Financial report Q1 2026\n2. Ramadan event planning\n3. Community welfare projects\n4. Youth program updates",
    minutes: "",
  },
  {
    id: 2n,
    title: "Musabaka Competition Organizing Committee",
    date: BigInt(new Date("2026-04-12").getTime()) * 1_000_000n,
    location: "Community Hall, Bugesera",
    agenda:
      "1. Competition categories and rules\n2. Judges selection\n3. Venue preparation\n4. Budget review",
    minutes: "",
  },
];

export const CAMPAIGN_GOALS: Record<ContributionCategory, number> = {
  [ContributionCategory.Irayidi]: 500000,
  [ContributionCategory.ZakatulFitr]: 200000,
  [ContributionCategory.Musabaka]: 1000000,
};

export const EXCHANGE_RATES: Record<Currency, number> = {
  [Currency.RWF]: 1,
  [Currency.USD]: 1300,
  [Currency.KES]: 10,
  [Currency.UGX]: 0.34,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  [Currency.RWF]: "RWF",
  [Currency.USD]: "USD",
  [Currency.KES]: "KES",
  [Currency.UGX]: "UGX",
};
