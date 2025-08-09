export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface YearlyPrayerTimes {
  source: 'tawkit' | 'calculated' | 'manual';
  data?: any; // Raw yearly data (e.g., Tawkit JS_TIMES array)
  metadata?: {
    method?: string;
    location?: string;
    calculationWebsite?: string;
  };
  lastUpdated: string;
}

export interface Mosque {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  prayerTimes: PrayerTimes; // Current day prayer times
  yearlyPrayerTimes?: YearlyPrayerTimes; // Full year data
  description?: string; // Optional description for special mosques
}
