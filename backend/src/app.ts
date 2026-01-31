// app.ts
import express from 'express';
import cors from 'cors';
import shanyrakRoutes from './routes/shanyraks.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/shanyraks', shanyrakRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

export default app;