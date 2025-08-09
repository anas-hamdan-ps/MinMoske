/**
 * Prayer Times Service
 * Handles prayer time calculations and data retrieval
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { PrayerTimes, YearlyPrayerTimes } from './models/mosque';
import { 
  parseTawkitFile, 
  getPrayerTimesForDate, 
  convertToPrayerTimes,
  TawkitPrayerTime 
} from './prayerTimesParser';

export class PrayerTimesService {
  
  /**
   * Load and parse Tawkit wtimes file
   */
  static loadTawkitFile(filePath: string): YearlyPrayerTimes {
    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const parsed = parseTawkitFile(fileContent);
      
      return {
        source: 'tawkit',
        data: parsed.prayerTimes,
        metadata: {
          method: parsed.metadata.method,
          location: parsed.metadata.location,
          calculationWebsite: parsed.metadata.calculationWebsite
        },
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error loading Tawkit file:', error);
      throw new Error(`Failed to load Tawkit file: ${filePath}`);
    }
  }

  /**
   * Get current day prayer times from yearly data
   */
  static getCurrentPrayerTimes(yearlyData: YearlyPrayerTimes, date?: Date): PrayerTimes {
    const targetDate = date || new Date();
    
    if (yearlyData.source === 'tawkit' && yearlyData.data) {
      const tawkitTimes = getPrayerTimesForDate(
        yearlyData.data as TawkitPrayerTime[], 
        targetDate
      );
      
      if (tawkitTimes) {
        return convertToPrayerTimes(tawkitTimes);
      }
    }
    
    // Fallback to default times if no data found
    return {
      fajr: '05:00',
      dhuhr: '12:30',
      asr: '15:30',
      maghrib: '18:00',
      isha: '19:30'
    };
  }

  /**
   * Load Angered mosque data from the wtimes file
   */
  static loadAngeredMosqueData(): YearlyPrayerTimes {
    // Use path relative to current working directory
    const filePath = join(process.cwd(), 'wtimes-SE.ANGERED_(15-14).js');
    return this.loadTawkitFile(filePath);
  }

  /**
   * Load Göteborg mosque data from the wtimes file (15-14 method)
   */
  static loadGoteborgMosqueData(): YearlyPrayerTimes {
    const filePath = join(process.cwd(), 'wtimes-SE.GOETEBORG_(15-14).js');
    return this.loadTawkitFile(filePath);
  }

  /**
   * Load Göteborg mosque data from the alternative wtimes file
   */
  static loadGoteborgAlternativeMosqueData(): YearlyPrayerTimes {
    const filePath = join(process.cwd(), 'wtimes-SE.GOTEBORG.js');
    return this.loadTawkitFile(filePath);
  }

  /**
   * Get prayer times for a specific date range
   */
  static getPrayerTimesRange(
    yearlyData: YearlyPrayerTimes, 
    startDate: Date, 
    endDate: Date
  ): Array<{ date: string; prayerTimes: PrayerTimes }> {
    const result: Array<{ date: string; prayerTimes: PrayerTimes }> = [];
    
    if (yearlyData.source === 'tawkit' && yearlyData.data) {
      const tawkitData = yearlyData.data as TawkitPrayerTime[];
      
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const tawkitTimes = getPrayerTimesForDate(tawkitData, currentDate);
        
        if (tawkitTimes) {
          result.push({
            date: currentDate.toISOString().split('T')[0],
            prayerTimes: convertToPrayerTimes(tawkitTimes)
          });
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    return result;
  }

  /**
   * Validate prayer times data
   */
  static validatePrayerTimes(prayerTimes: PrayerTimes): boolean {
    const times = [
      prayerTimes.fajr,
      prayerTimes.dhuhr,
      prayerTimes.asr,
      prayerTimes.maghrib,
      prayerTimes.isha
    ];
    
    // Check if all times are in valid HH:MM format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return times.every(time => timeRegex.test(time));
  }
}
