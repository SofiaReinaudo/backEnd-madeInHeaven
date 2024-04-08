import { Router } from 'express';
import { getTickets } from '../controllers/tickets.js';
import { validarJWT } from '../middleware/auth.js';

const router = Router();

router.get('/', validarJWT, getTickets);

export { router as ticketsRouter };