import express from 'express';
import { createPOrder, getPOrders } from '../controllers/pos.controller.js';

const router = express.Router();

// Create a new POS order
router.post('/', createPOrder);

// Get all POS orders
router.get('/', getPOrders);

export default router;
