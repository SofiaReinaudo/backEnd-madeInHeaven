import { request, response } from 'express';
import { TicketsRepository } from '../repositories/index.js';

export const getTickets = async (req = request, res = response) => {
    try {
        const email = req.email;
        const tickets = await TicketsRepository.getTicketsByEmail(email);
        return res.json({ tickets });
    } catch (error) {
        return res.status(500).json({ msg: 'Hablar con un administrador' });
    }
}