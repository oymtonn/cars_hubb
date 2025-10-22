import { getCars, getCarById, createCar, updateCar, deleteCar } from '../controllers/cars.js';
import express from 'express';

const router = express.Router();

router.get('/', getCars);
router.get('/:id', getCarById);
router.post('/', createCar);
router.patch('/:id', updateCar);
router.delete('/:id', deleteCar);

export default router;
