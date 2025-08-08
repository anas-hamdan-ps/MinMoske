import express, { Request, Response } from 'express';
import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from '../dynamoClient';

const router = express.Router();

interface PrayerTimes {
  fajr: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface Mosque {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  prayerTimes: PrayerTimes;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const { lat, lng, q } = req.query;
    const radiusKm = (req.query.radiusKm as string) ?? '25';
    const params = { TableName: process.env.DYNAMO_TABLE! };
    const data = await docClient.send(new ScanCommand(params));
    let items = data.Items as Mosque[] || [];

    if (q && typeof q === 'string') {
      const search = q.toLowerCase();
      items = items.filter(m =>
        m.name.toLowerCase().includes(search) ||
        m.city.toLowerCase().includes(search) ||
        m.country.toLowerCase().includes(search)
      );
    } else if (lat && lng && typeof lat === 'string' && typeof lng === 'string') {
      const radius = parseFloat(String(radiusKm));
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const deg = radius / 111;
      const minLat = latNum - deg;
      const maxLat = latNum + deg;
      const minLng = lngNum - deg;
      const maxLng = lngNum + deg;
      items = items.filter(m =>
        m.lat >= minLat && m.lat <= maxLat &&
        m.lng >= minLng && m.lng <= maxLng
      );
    }

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: process.env.DYNAMO_TABLE!,
      Key: { id: req.params.id }
    }));
    if (!result.Item) return res.status(404).json({ error: 'Not found' });
    res.json(result.Item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
