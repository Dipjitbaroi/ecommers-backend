import { Router } from "express";
const router = Router();
import {subscription,getSubscribed} from '../controllers/subscription.controller.js';

router.post('/:email',subscription);
router.get('/',getSubscribed);


export default router;