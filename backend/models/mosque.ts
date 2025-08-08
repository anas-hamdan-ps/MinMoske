export interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface Mosque {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  prayerTimes: PrayerTimes;
}
