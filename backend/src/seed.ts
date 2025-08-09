import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { PrayerTimesService } from './prayerTimesService';

const tableName = process.env.DYNAMO_TABLE;
const region =
  process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'eu-north-1';

if (!tableName) {
  console.error('DYNAMO_TABLE env not set');
  process.exit(1);
}

const client = new DynamoDBClient({ region });
const ddb = DynamoDBDocumentClient.from(client);

// Load Angered mosque data with Tawkit prayer times
const angeredYearlyData = PrayerTimesService.loadAngeredMosqueData();
const angeredTodayTimes =
  PrayerTimesService.getCurrentPrayerTimes(angeredYearlyData);

// Load Göteborg mosque data with Tawkit prayer times
const goteborgYearlyData = PrayerTimesService.loadGoteborgMosqueData();
const goteborgTodayTimes =
  PrayerTimesService.getCurrentPrayerTimes(goteborgYearlyData);

// Load Göteborg alternative mosque data
const goteborgAltYearlyData =
  PrayerTimesService.loadGoteborgAlternativeMosqueData();
const goteborgAltTodayTimes = PrayerTimesService.getCurrentPrayerTimes(
  goteborgAltYearlyData
);

const mosques = [
  {
    id: 'stockholm-mosque-1',
    name: 'Stockholm Central Mosque',
    city: 'Stockholm',
    country: 'Sweden',
    lat: 59.3326,
    lng: 18.0649,
    prayerTimes: {
      fajr: '03:10',
      dhuhr: '12:45',
      asr: '16:45',
      maghrib: '21:25',
      isha: '23:00',
    },
  },
  {
    id: 'gothenburg-mosque-1',
    name: 'Gothenburg Mosque',
    city: 'Gothenburg',
    country: 'Sweden',
    lat: 57.7089,
    lng: 11.9746,
    prayerTimes: {
      fajr: '03:20',
      dhuhr: '12:50',
      asr: '16:50',
      maghrib: '21:35',
      isha: '23:10',
    },
  },
  {
    id: 'malmo-mosque-1',
    name: 'Malmö Mosque',
    city: 'Malmö',
    country: 'Sweden',
    lat: 55.605,
    lng: 13.0038,
    prayerTimes: {
      fajr: '03:30',
      dhuhr: '12:55',
      asr: '16:55',
      maghrib: '21:40',
      isha: '23:15',
    },
  },
  {
    id: 'angered-mosque-1',
    name: 'Angered Mosque',
    city: 'Angered',
    country: 'Sweden',
    lat: 57.7833, // Approximate coordinates for Angered, Gothenburg
    lng: 12.0333,
    prayerTimes: angeredTodayTimes, // Today's prayer times from Tawkit data
    yearlyPrayerTimes: angeredYearlyData, // Full year data
  },
  {
    id: 'goteborg-mosque-1',
    name: 'Göteborg Central Mosque',
    city: 'Göteborg',
    country: 'Sweden',
    lat: 57.7089,
    lng: 11.9746,
    prayerTimes: goteborgTodayTimes, // Today's prayer times from Tawkit data (15-14 method)
    yearlyPrayerTimes: goteborgYearlyData, // Full year data
  },
  {
    id: 'vr-17-mosque',
    name: 'VR-17 Mosque',
    city: 'Göteborg',
    country: 'Sweden',
    lat: 57.7089,
    lng: 11.9746,
    prayerTimes: goteborgAltTodayTimes, // Today's prayer times from alternative Tawkit data
    yearlyPrayerTimes: goteborgAltYearlyData, // Full year data
    description:
      'VR-17 Mosque with specialized prayer time calculations for Göteborg',
  },
];

async function main() {
  for (const m of mosques) {
    console.log('Putting', m.id);
    await ddb.send(new PutCommand({ TableName: tableName, Item: m }));
  }
  console.log('Seed complete');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

