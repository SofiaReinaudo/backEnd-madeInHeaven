import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

export const sendEmail = async (email, url) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth:{
                user: process.env.USER_EMAIL,
                pass: process.env.PASS_EMAIL,
            },
        });

        await transporter.sendEmail({
            from: `Ecommerce <sofiareinaudo22@gmail.com>`,
            to: `${email}`,
            subject: 'Cambiar contraseña',
            html: templateHtmlEmail(email, url)
        })

    } catch (error) {
        logger.error(error)
    }
}

const templateHtmlEmail = (email, url) => {
    const titulo = 'Cambiar contraseña en la cuenta de Ecommerce';
    const link = url;
    return (
        `<div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h1 style="color: #e91e63;">Recuperación de Contraseña</h1>
            <p style="margin-bottom: 20px;">Hola "${email}",</p>
            <p style="margin-bottom: 20px;">Hemos recibido una solicitud para "${titulo}". Haz clic en el siguiente enlace para completar el proceso:</p>
            <p style="margin-bottom: 20px;"><a href="${link}" style="display: inline-block; padding: 10px 20px; font-size: 16px; text-decoration: none; color: #fff; background-color: #e91e63; border-radius: 5px;">Restablecer Contraseña</a></p>
            <p style="margin-bottom: 20px;">Si no solicitaste el restablecimiento de la contraseña, puedes ignorar este correo.</p>
            <div style="text-align: center; color: #999;">
                <p>Gracias,</p>
                <p>El equipo de Made In Heaven</p>
            </div>
        </div>`
    );
}