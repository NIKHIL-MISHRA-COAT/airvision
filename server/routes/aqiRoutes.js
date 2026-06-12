import express from 'express';
import { getAQIData } from '../controllers/aqiController.js';

const router = express.Router();

router.get('/', getAQIData);

export default router;
