import { Router } from "express";
const router = Router();
import {placeOrder,getOrders,getOrdersByUserId,updateOrder} from '../controllers/order.controller.js';

router.post('/order',placeOrder);
router.get('/order/:userId',getOrdersByUserId);
router.get('/orders/',getOrders);
router.patch('/order-update/:orderId',updateOrder);


export default router;