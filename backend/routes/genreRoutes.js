import express from 'express';
import { listGenres } from '../controllers/bookController.js'; 
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, listGenres);

export default router;