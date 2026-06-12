import express from 'express';
import { handlePrediction } from '../controllers/predictionController.js'; // Add .js for ES modules
const predictRouter = express.Router();
export default predictRouter.get('/', handlePrediction);

// module.exports = router;

