import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRouter from './routes/items.js';
import carRouter from './routes/cars.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/cars', carRouter);
app.use('/items', itemRouter);

app.get('/', (req, res) => {
    res.status(200).send('Car Server');
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})