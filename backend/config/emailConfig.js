import { Resend } from "resend";

const resend = new Resend("re_BexFYimB_A389F58aqcFUbGwvAnAp3m8L");

export const sendEmail = async ({ firstName, lastName, email, phone, message }) => {
  return await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "mlkmoaz01@gmail.com",
    subject: "New Contact Form Submission",
    text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
  });
};