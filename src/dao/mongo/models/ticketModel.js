import { Schema, model } from 'mongoose';

const nameCollection = 'Ticket';

const TicketSchema = new Schema({
    code: { type: String, required: [true, 'El code es obligatorio'] },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: [true, 'El amount (total de la compra) es obligatorio'] },
    purchase: { type: String, required: [true, 'El purchase (email) es obligatorio'] },
    items: [{ type: Object, required: [true, 'La propidad items es obligatoria'] }],
});

TicketSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.__v;
        return ret;
    }
});

export const ticketModel = model(nameCollection, TicketSchema);