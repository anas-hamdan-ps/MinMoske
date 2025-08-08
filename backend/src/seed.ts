import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const tableName = process.env.DYNAMO_TABLE;
const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'eu-north-1';

if (!tableName) {
  console.error('DYNAMO_TABLE env not set');
  process.exit(1);
}

const client = new DynamoDBClient({ region });
const ddb = DynamoDBDocumentClient.from(client);

const mosques = [
  {
    id: 'stockholm-mosque-1',
    name: 'Stockholm Central Mosque',
    city: 'Stockholm',
    country: 'Sweden',
    lat: 59.3326,
    lng: 18.0649,
    prayerTimes: { fajr: '03:10', dhuhr: '12:45', asr: '16:45', maghrib: '21:25', isha: '23:00' },
  },
  {
    id: 'gothenburg-mosque-1',
    name: 'Gothenburg Mosque',
    city: 'Gothenburg',
    country: 'Sweden',
    lat: 57.7089,
    lng: 11.9746,
    prayerTimes: { fajr: '03:20', dhuhr: '12:50', asr: '16:50', maghrib: '21:35', isha: '23:10' },
  },
  {
    id: 'malmo-mosque-1',
    name: 'Malmö Mosque',
    city: 'Malmö',
    country: 'Sweden',
    lat: 55.6050,
    lng: 13.0038,
    prayerTimes: { fajr: '03:30', dhuhr: '12:55', asr: '16:55', maghrib: '21:40', isha: '23:15' },
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

