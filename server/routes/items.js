import { getItemsByCategory } from '../controllers/items.js';
import express from 'express';

const router = express.Router();

router.get('/', getItemsByCategory);

export default router;