import { Router } from "express";
const router = Router();
import {addOrUpdateCart,getCartbyUserId, deleteCartbyUserId} from '../controllers/cart.controller.js';


router.patch('/', addOrUpdateCart);

router.get('/:id',getCartbyUserId);

router.delete('/:userId/:productId',deleteCartbyUserId);



export default router;