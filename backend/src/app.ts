import express from 'express';
import cors from 'cors';
import mosquesRouter from './routes/mosques';

const app = express();
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Mosque Finder API running' });
});

app.use('/api/mosques', mosquesRouter);

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
