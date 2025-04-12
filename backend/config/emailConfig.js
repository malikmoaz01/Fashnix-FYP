import { Resend } from "resend";

const resend = new Resend("re_BexFYimB_A389F58aqcFUbGwvAnAp3m8L");

export const sendEmail = async ({ firstName, lastName, email, phone, message }) => {
  return await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "mlkmoaz01@gmail.com",
    subject: "New Contact Form Submission",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #4a6cf7;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: #f9f9f9;
              padding: 20px;
              border-left: 1px solid #ddd;
              border-right: 1px solid #ddd;
            }
            .message-box {
              background-color: white;
              padding: 15px;
              border-radius: 5px;
              border: 1px solid #eee;
              margin-top: 15px;
            }
            .footer {
              background-color: #f1f1f1;
              padding: 15px;
              text-align: center;
              font-size: 12px;
              color: #777;
              border-radius: 0 0 5px 5px;
              border: 1px solid #ddd;
              border-top: none;
            }
            .contact-row {
              margin-bottom: 10px;
            }
            .label {
              font-weight: bold;
              color: #555;
            }
            .value {
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="contact-row">
              <span class="label">Name:</span> 
              <span class="value">${firstName} ${lastName}</span>
            </div>
            <div class="contact-row">
              <span class="label">Email:</span> 
              <span class="value">${email}</span>
            </div>
            <div class="contact-row">
              <span class="label">Phone:</span> 
              <span class="value">${phone}</span>
            </div>
            <div class="contact-row">
              <span class="label">Message:</span>
            </div>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div class="footer">
            <p>This email was sent from fashniz.</p>
          </div>
        </body>
      </html>
    `,
  });
};