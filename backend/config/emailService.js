import { Resend } from "resend";
const resend = new Resend("re_BexFYimB_A389F58aqcFUbGwvAnAp3m8L");

const styles = {
  mainColor: "#4a6fa5", 
  accentColor: "#e83e8c", 
  lightBlue: "#eaf0f8",
  lightPink: "#fce8f3",
  borderRadius: "8px",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const emailHeader = `
  <div style="background: linear-gradient(135deg, ${styles.mainColor}, ${styles.accentColor}); 
              color: white; 
              padding: 30px 20px; 
              text-align: center; 
              border-radius: ${styles.borderRadius} ${styles.borderRadius} 0 0;">
    <h1 style="margin: 0; font-family: ${styles.fontFamily}; font-size: 28px;">Fashniz</h1>
  </div>
`;

const emailFooter = `
  <div style="background-color: #f8f9fa; 
              padding: 20px; 
              text-align: center; 
              border-radius: 0 0 ${styles.borderRadius} ${styles.borderRadius};
              color: #666;
              font-family: ${styles.fontFamily};
              margin-top: 30px;">
    <p>© 2025 Fashniz. All rights reserved.</p>
    <div style="margin: 15px 0;">
      <a href="#" style="color: ${styles.mainColor}; text-decoration: none; margin: 0 10px;">Contact Us</a>
      <a href="#" style="color: ${styles.mainColor}; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
      <a href="#" style="color: ${styles.mainColor}; text-decoration: none; margin: 0 10px;">Terms of Service</a>
    </div>
    <div style="margin-top: 15px;">
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://via.placeholder.com/30" alt="Facebook" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://via.placeholder.com/30" alt="Instagram" style="width: 24px; height: 24px;">
      </a>
      <a href="#" style="display: inline-block; margin: 0 8px;">
        <img src="https://via.placeholder.com/30" alt="Twitter" style="width: 24px; height: 24px;">
      </a>
    </div>
  </div>
`;

export const sendOrderConfirmationEmail = async (order) => {
  const itemsListHTML = order.items.map(item =>
    `<tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="text-align: center; padding: 12px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="text-align: right; padding: 12px; border-bottom: 1px solid #eee;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
  ).join('');

  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: order.customerEmail,
    subject: `🎉 Order Confirmation #${order.orderId}`,
    html: `
      <div style="font-family: ${styles.fontFamily}; max-width: 600px; margin: 0 auto; border-radius: ${styles.borderRadius}; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        ${emailHeader}
        
        <div style="padding: 30px; background-color: white;">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="https://via.placeholder.com/80" alt="Order Confirmed" style="width: 80px; height: 80px;">
            <h2 style="color: ${styles.mainColor}; margin: 15px 0 5px;">Thank You for Your Order!</h2>
            <p style="color: #666; margin: 0;">We're preparing your items with care.</p>
          </div>
          
          <div style="background-color: ${styles.lightBlue}; 
                      border-left: 4px solid ${styles.mainColor}; 
                      padding: 15px; 
                      margin: 25px 0;
                      border-radius: 4px;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> <span style="color: ${styles.accentColor};">#${order.orderId}</span></p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p style="margin: 5px 0;"><strong>Order Status:</strong> 
              <span style="background-color: ${styles.accentColor}; 
                          color: white; 
                          padding: 3px 8px; 
                          border-radius: 12px; 
                          font-size: 12px;">
                ${order.status}
              </span>
            </p>
          </div>
          
          <h3 style="color: ${styles.mainColor}; border-bottom: 2px solid ${styles.lightPink}; padding-bottom: 8px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background-color: ${styles.lightBlue};">
              <th style="text-align: left; padding: 12px; color: ${styles.mainColor};">Item</th>
              <th style="text-align: center; padding: 12px; color: ${styles.mainColor};">Qty</th>
              <th style="text-align: right; padding: 12px; color: ${styles.mainColor};">Price</th>
            </tr>
            ${itemsListHTML}
            <tr style="font-weight: bold; background-color: ${styles.lightPink};">
              <td colspan="2" style="text-align: right; padding: 12px;">Total:</td>
              <td style="text-align: right; padding: 12px; color: ${styles.accentColor};">$${order.totalAmount.toFixed(2)}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; background-color: ${styles.lightBlue}; padding: 20px; border-radius: 4px;">
            <h3 style="color: ${styles.mainColor}; margin-top: 0; border-bottom: 2px solid ${styles.lightPink}; padding-bottom: 8px;">Shipping Address</h3>
            <p style="margin-bottom: 0; line-height: 1.6;">
              ${order.shippingAddress.street}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}<br>
              ${order.shippingAddress.country}
            </p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="#" style="display: inline-block; 
                              background: linear-gradient(to right, ${styles.mainColor}, ${styles.accentColor}); 
                              color: white; 
                              padding: 12px 30px; 
                              text-decoration: none; 
                              border-radius: 25px;
                              font-weight: bold;">
              Track Your Order
            </a>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; border: 1px dashed ${styles.accentColor}; border-radius: 4px;">
            <p style="margin: 0; color: #666;">
              <strong>Need help?</strong> Our customer support team is here for you! 
              <a href="mailto:mlkmoaz01@gmail.com" style="color: ${styles.accentColor}; text-decoration: none;">mlkmoaz01@gmail.com</a>
            </p>
          </div>
        </div>
        
        ${emailFooter}
      </div>
    `
  });
  return response;
};

export const sendOrderStatusEmail = async (order) => {
  let statusColor = styles.accentColor;
  let statusIcon = "https://via.placeholder.com/80";
  let statusMessage = "We're working on your order.";
  
  switch(order.status.toLowerCase()) {
    case 'shipped':
      statusColor = "#28a745"; // Green
      statusMessage = "Your order is on its way to you!";
      break;
    case 'delivered':
      statusColor = "#17a2b8"; // Teal
      statusMessage = "Your order has been delivered. Enjoy!";
      break;
    case 'processing':
      statusColor = "#ffc107"; 
      statusMessage = "We're preparing your items for shipment.";
      break;
    case 'cancelled':
      statusColor = "#dc3545"; 
      statusMessage = "Your order has been cancelled.";
      break;
  }

  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: order.customerEmail,
    subject: `📦 Update: Your Order #${order.orderId} is now ${order.status}`,
    html: `
      <div style="font-family: ${styles.fontFamily}; max-width: 600px; margin: 0 auto; border-radius: ${styles.borderRadius}; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        ${emailHeader}
        
        <div style="padding: 30px; background-color: white;">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="${statusIcon}" alt="Order Status" style="width: 80px; height: 80px;">
            <h2 style="color: ${styles.mainColor}; margin: 15px 0 5px;">Your Order Status Has Been Updated</h2>
            <p style="color: #666; margin: 0;">${statusMessage}</p>
          </div>
          
          <div style="background-color: ${styles.lightBlue}; 
                      border-left: 4px solid ${statusColor}; 
                      padding: 20px; 
                      margin: 25px 0;
                      border-radius: 4px;
                      text-align: center;">
            <p style="margin: 0; font-size: 18px;">
              Your order #${order.orderId} is now: 
              <span style="background-color: ${statusColor}; 
                          color: white; 
                          padding: 5px 15px; 
                          border-radius: 20px; 
                          font-weight: bold;
                          display: inline-block;
                          margin-top: 10px;">
                ${order.status}
              </span>
            </p>
          </div>
          
          <div style="background-color: ${styles.lightPink};
                      padding: 15px; 
                      margin: 25px 0;
                      border-radius: 4px;">
            <p style="margin: 5px 0;"><strong>Order Number:</strong> #${order.orderId}</p>
            <p style="margin: 5px 0;"><strong>Updated On:</strong> ${new Date(order.updatedAt).toLocaleString()}</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="#" style="display: inline-block; 
                              background: linear-gradient(to right, ${styles.mainColor}, ${statusColor}); 
                              color: white; 
                              padding: 12px 30px; 
                              text-decoration: none; 
                              border-radius: 25px;
                              font-weight: bold;
                              margin-right: 10px;">
              Track Your Order
            </a>
            <a href="#" style="display: inline-block; 
                              background: white; 
                              color: ${styles.mainColor}; 
                              padding: 12px 30px; 
                              text-decoration: none; 
                              border-radius: 25px;
                              font-weight: bold;
                              border: 2px solid ${styles.mainColor};">
              View Order Details
            </a>
          </div>
          
          <div style="margin-top: 30px; 
                      background: linear-gradient(135deg, ${styles.lightBlue}, ${styles.lightPink}); 
                      padding: 20px; 
                      border-radius: 4px; 
                      text-align: center;">
            <h3 style="color: ${styles.mainColor}; margin-top: 0;">What's Next?</h3>
            <p style="margin-bottom: 0;">
              You will receive another update when your order status changes again. 
              You can also check your order status anytime by visiting our website.
            </p>
          </div>
        </div>
        
        ${emailFooter}
      </div>
    `
  });
  return response;
};