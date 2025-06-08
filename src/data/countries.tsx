export type Nationality = "ar" | "us" | "jp" | "es" | "uk" | "mx" | "br" | "de" | "ca" | "in" | "au" | "cn" | "fr" | "it" | "ru" | "kr"

export interface Country {
  label: string;
  value: Nationality;
  lifeExpectancy: number;
}

export const countries: Country[] = [
  { label: 'Argentina', value: 'ar', lifeExpectancy: 78.5 },
  { label: 'United States', value: 'us', lifeExpectancy: 78.5 },
  { label: 'Japan', value: 'jp', lifeExpectancy: 84.3 },
  { label: 'Spain', value: 'es', lifeExpectancy: 83.0 },
  { label: 'United Kingdom', value: 'uk', lifeExpectancy: 81.2 },
  { label: 'Mexico', value: 'mx', lifeExpectancy: 75.0 },
  { label: 'Brazil', value: 'br', lifeExpectancy: 75.5 },
  { label: 'Germany', value: 'de', lifeExpectancy: 81.1 },
  { label: 'Canada', value: 'ca', lifeExpectancy: 82.3 },
  { label: 'India', value: 'in', lifeExpectancy: 69.7 },
  { label: 'Australia', value: 'au', lifeExpectancy: 83.4 },
  { label: 'China', value: 'cn', lifeExpectancy: 77.1 },
  { label: 'France', value: 'fr', lifeExpectancy: 82.7 },
  { label: 'Italy', value: 'it', lifeExpectancy: 83.2 },
  { label: 'Russia', value: 'ru', lifeExpectancy: 72.5 },
  { label: 'South Korea', value: 'kr', lifeExpectancy: 83.0 },
];
