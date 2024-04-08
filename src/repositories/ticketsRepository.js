import { TicketDao } from "../dao/index.js";

export const getTicketById = async (id) => await TicketDao.getTicketById(id);
export const getTicketByEmail = async (email) => await TicketDao.getTicketByEmail(email);
export const getTicketsByEmail = async (email) => await TicketDao.getTicketsByEmail(email);
export const createTicket = async (ticket) => await TicketDao.createTicket(ticket);