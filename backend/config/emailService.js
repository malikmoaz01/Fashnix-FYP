import { Resend } from "resend";

const resend = new Resend("re_BexFYimB_A389F58aqcFUbGwvAnAp3m8L");

export const sendOrderConfirmationEmail = async (order) => {
  const itemsListHTML = order.items.map(item => 
    `<tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
      <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: order.customerEmail,
    subject: `Order Confirmation #${order.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for your order!</h2>
        <p>We've received your order and we're working on it now.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
          <p><strong>Order Number:</strong> ${order.orderId}</p>
          <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
          <p><strong>Order Status:</strong> ${order.status}</p>
        </div>
        
        <h3>Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #f5f5f5;">
            <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Item</th>
            <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Qty</th>
            <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">Price</th>
          </tr>
          ${itemsListHTML}
          <tr style="font-weight: bold;">
            <td colspan="2" style="text-align: right; padding: 8px; border: 1px solid #ddd;">Total:</td>
            <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">$${order.totalAmount.toFixed(2)}</td>
          </tr>
        </table>
        
        <div style="margin-top: 20px;">
          <h3>Shipping Address</h3>
          <p>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
            ${order.shippingAddress.country}
          </p>
        </div>
        
        <div style="margin-top: 20px; color: #666;">
          <p>If you have any questions, please contact our customer support.</p>
        </div>
      </div>
    `
  });

  return response;
};

export const sendOrderStatusEmail = async (order) => {
  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: order.customerEmail,
    subject: `Order #${order.orderId} Status Update`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Order Status Has Been Updated</h2>
        <p>Your order #${order.orderId} is now: <strong>${order.status}</strong></p>
        
        <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
          <p><strong>Order Number:</strong> ${order.orderId}</p>
          <p><strong>Updated On:</strong> ${new Date(order.updatedAt).toLocaleString()}</p>
        </div>
        
        <div style="margin-top: 20px;">
          <p>You can track your order anytime by visiting our website.</p>
        </div>
      </div>
    `
  });

  return response;
};
