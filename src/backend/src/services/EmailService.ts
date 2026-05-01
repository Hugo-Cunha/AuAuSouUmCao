import nodemailer from 'nodemailer';

// Configurar o transporter para envio de emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com', // Exemplo para Gmail
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true para 465, false para outros
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
  console.log(`Enviando email para ${to} com assunto "${subject}" e texto "${text}"`);

  await transporter.sendMail(mailOptions);
};