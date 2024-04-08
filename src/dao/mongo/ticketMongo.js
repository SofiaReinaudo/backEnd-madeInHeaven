import { ticketModel } from './models/ticketModel.js';

export const getTicketById = async (id) => await ticketModel.findById(id);
export const getTicketByEmail = async (email) => await ticketModel.findOne({ purchase:email });
export const getTicketsByEmail = async (email) => await ticketModel.find({ purchase:email });
export const createTicket = async (ticket) => await ticketModel.create({ ...ticket });