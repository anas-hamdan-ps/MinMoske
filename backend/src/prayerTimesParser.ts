/**
 * Tawkit Prayer Times Parser
 * Parses Tawkit wtimes files and converts them to our database format
 */

export interface TawkitPrayerTime {
  date: string; // MM-DD format
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export interface TawkitMetadata {
  location: string;
  country: string;
  city: string;
  method: string;
  asrType: string;
  calculationWebsite: string;
  calculationScript: string;
  geographicalDatabase: string;
}

export interface ParsedTawkitData {
  metadata: TawkitMetadata;
  prayerTimes: TawkitPrayerTime[];
}

/**
 * Parse Tawkit wtimes file content
 */
export function parseTawkitFile(fileContent: string): ParsedTawkitData {
  const lines = fileContent.split('\n');
  const metadata: TawkitMetadata = {
    location: '',
    country: '',
    city: '',
    method: '',
    asrType: '',
    calculationWebsite: '',
    calculationScript: '',
    geographicalDatabase: ''
  };
  
  const prayerTimes: TawkitPrayerTime[] = [];
  
  // Parse header metadata
  for (const line of lines) {
    if (line.includes('|')) {
      // Location line: "SE|Sweden - ANGERED_(15-14)"
      const locationMatch = line.match(/([A-Z]{2})\|(.+?) - (.+)/);
      if (locationMatch) {
        metadata.country = locationMatch[2];
        metadata.city = locationMatch[3];
        metadata.location = line;
      }
    } else if (line.includes('Method')) {
      metadata.method = line.split(':')[1]?.trim() || '';
    } else if (line.includes('ASR Type')) {
      metadata.asrType = line.split(':')[1]?.trim() || '';
    } else if (line.includes('Calculation Website')) {
      metadata.calculationWebsite = line.split(':')[1]?.trim() || '';
    } else if (line.includes('Calculation Script')) {
      metadata.calculationScript = line.split(':')[1]?.trim() || '';
    } else if (line.includes('Geographical Database')) {
      metadata.geographicalDatabase = line.split(':')[1]?.trim() || '';
    }
  }
  
  // Find the JS_TIMES array
  let inTimesArray = false;
  for (const line of lines) {
    if (line.includes('var JS_TIMES =')) {
      inTimesArray = true;
      continue;
    }
    
    if (inTimesArray && line.includes('];')) {
      break;
    }
    
    if (inTimesArray && line.includes('~~~~~')) {
      // Parse prayer time line: "01-01~~~~~06:49|08:55|12:15|13:24|15:36|17:34"
      const match = line.match(/"(\d{2}-\d{2})~~~~~(.+)"/);
      if (match) {
        const date = match[1];
        const times = match[2].split('|');
        
        if (times.length === 6) {
          prayerTimes.push({
            date,
            fajr: times[0],
            sunrise: times[1],
            dhuhr: times[2],
            asr: times[3],
            maghrib: times[4],
            isha: times[5]
          });
        }
      }
    }
  }
  
  return { metadata, prayerTimes };
}

/**
 * Get prayer times for a specific date
 */
export function getPrayerTimesForDate(
  prayerTimes: TawkitPrayerTime[], 
  date: Date
): TawkitPrayerTime | null {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateKey = `${month}-${day}`;
  
  return prayerTimes.find(pt => pt.date === dateKey) || null;
}

/**
 * Get prayer times for today
 */
export function getTodaysPrayerTimes(prayerTimes: TawkitPrayerTime[]): TawkitPrayerTime | null {
  return getPrayerTimesForDate(prayerTimes, new Date());
}

/**
 * Convert TawkitPrayerTime to our PrayerTimes interface
 */
export function convertToPrayerTimes(tawkitTimes: TawkitPrayerTime) {
  return {
    fajr: tawkitTimes.fajr,
    dhuhr: tawkitTimes.dhuhr,
    asr: tawkitTimes.asr,
    maghrib: tawkitTimes.maghrib,
    isha: tawkitTimes.isha
  };
}
