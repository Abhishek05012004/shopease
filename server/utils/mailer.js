const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOrderConfirmation({ to, order }) {
  if (!to) return;
  const subject = `Order Confirmation - ${order._id}`;
  const total = (order.totalPrice || 0).toFixed(2);
  const subtotal = (order.itemsPrice || 0).toFixed(2);
  const shipping = (order.shippingPrice || 0).toFixed(2);
  const status = order.isPaid ? "Paid" : order.status || "Pending";

  const itemsHtml = (order.orderItems || [])
    .map(
      (it) =>
        `<tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 0; font-size: 15px; color: #334155;">
            <div style="font-weight: 600; color: #1e293b;">${it.name}</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 2px;">Qty: ${it.quantity}</div>
          </td>
          <td style="padding: 12px 0; text-align: right; font-size: 15px; font-weight: 600; color: #1e293b; vertical-align: top;">
            ₹${(it.price * it.quantity).toFixed(2)}
          </td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; background-color: #fef08a; padding: 12px; border-radius: 12px; margin-bottom: 16px;">
          <span style="font-size: 24px; font-weight: bold; color: #854d0e;">SE</span>
        </div>
        <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Order Confirmed!</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Thank you for your purchase. We are processing your order.</p>
      </div>
      
      <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-bottom: 24px;">
        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">Hello,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">Your order has been successfully placed. Here are the details of your transaction:</p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Order ID:</td>
              <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: 600;">${order._id}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Payment Status:</td>
              <td style="padding: 4px 0; text-align: right; color: #15803d; font-weight: 600;">${status}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b; font-weight: 500;">Payment Method:</td>
              <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: 600;">${order.paymentMethod}</td>
            </tr>
          </table>
        </div>

        <h3 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Items Summary</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <th style="text-align: left; padding-bottom: 8px; font-size: 13px; color: #64748b; font-weight: 600;">Product</th>
              <th style="text-align: right; padding-bottom: 8px; font-size: 13px; color: #64748b; font-weight: 600;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #64748b;">Subtotal</td>
              <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: 600;">₹${subtotal}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;">Shipping</td>
              <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: 600;">₹${shipping}</td>
            </tr>
            <tr style="font-size: 16px; font-weight: 700; border-top: 1px dashed #e2e8f0;">
              <td style="padding: 12px 0 0 0; color: #1e293b;">Total Paid</td>
              <td style="padding: 12px 0 0 0; text-align: right; color: #854d0e;">₹${total}</td>
            </tr>
          </table>
        </div>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0;">If you have any questions about this invoice, feel free to reply directly to this email.</p>
        <p style="color: #64748b; font-size: 13px; font-weight: 600; margin: 0;">ShopEase Inc.</p>
      </div>
    </div>
  `;
  const text = `Thank you for your order!\nOrder ID: ${order._id}\nStatus: ${status}\nPayment Method: ${order.paymentMethod}\nTotal: ₹${total}`;

  await transporter.sendMail({
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

async function sendOtpEmail({ to, otp, type = "signup" }) {
  if (!to) return;
  const isForgot = type === "forgot";
  const subject = isForgot ? "ShopEase - Password Reset OTP" : "ShopEase - Your Signup OTP";
  const actionText = isForgot ? "reset your password" : "verify your email address";
  const titleText = isForgot ? "Password Reset Verification" : "Email Verification";

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; background-color: #fef08a; padding: 12px; border-radius: 12px; margin-bottom: 16px;">
          <span style="font-size: 24px; font-weight: bold; color: #854d0e;">SE</span>
        </div>
        <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">${titleText}</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Secure OTP Verification for ShopEase</p>
      </div>
      
      <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-bottom: 24px;">
        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">Hello,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">Thank you for choosing ShopEase. To ${actionText}, please use the following one-time verification code (OTP):</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <div style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #854d0e; background-color: #fef9c3; padding: 16px 32px; border-radius: 12px; border: 1px solid #fef08a; font-family: monospace;">${otp}</div>
        </div>
        
        <p style="color: #e11d48; font-size: 13px; font-weight: 500; line-height: 1.6; margin: 24px 0 0 0; background-color: #fff1f2; padding: 12px 16px; border-radius: 8px; border-left: 4px solid #f43f5e;">
          ⚠️ <strong>Security Notice:</strong> This OTP is valid for 10 minutes. Please do not share this code with anyone, including ShopEase staff.
        </p>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0;">If you did not request this code, you can safely ignore this email.</p>
        <p style="color: #64748b; font-size: 13px; font-weight: 600; margin: 0;">ShopEase Inc.</p>
      </div>
    </div>
  `;
  const text = `ShopEase OTP for ${isForgot ? "Password Reset" : "Signup"}: ${otp}`;

  await transporter.sendMail({
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

async function sendOrderCancellation({ to, order }) {
  if (!to) return;
  const subject = `Order Cancelled - ${order._id}`;
  const total = (order.totalPrice || 0).toFixed(2);
  const subtotal = (order.itemsPrice || 0).toFixed(2);
  const shipping = (order.shippingPrice || 0).toFixed(2);

  const refundHtml = order.isPaid
    ? `<div style="margin-top: 24px; padding: 16px; background-color: #fff1f2; border-left: 4px solid #f43f5e; border-radius: 8px; color: #be123c; font-size: 13.5px; line-height: 1.6; font-weight: 500;">
         <strong>⚠️ Refund Information:</strong> Since your payment was successfully completed, your refund will be processed and credited back to your original payment method within 2 to 3 business days.
       </div>`
    : "";

  const itemsHtml = (order.orderItems || [])
    .map(
      (it) =>
        `<tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 0; font-size: 15px; color: #334155;">
            <div style="font-weight: 600; color: #1e293b;">${it.name}</div>
            <div style="font-size: 13px; color: #64748b; margin-top: 2px;">Qty: ${it.quantity}</div>
          </td>
          <td style="padding: 12px 0; text-align: right; font-size: 15px; font-weight: 600; color: #1e293b; vertical-align: top;">
            ₹${(it.price * it.quantity).toFixed(2)}
          </td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="display: inline-block; background-color: #ffe4e6; padding: 12px; border-radius: 12px; margin-bottom: 16px;">
          <span style="font-size: 24px; font-weight: bold; color: #e11d48;">✕</span>
        </div>
        <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Order Cancelled</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Order ID: ${order._id}</p>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-bottom: 24px;">
        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">Hello,</p>
        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0;">We regret to inform you that your order has been cancelled. Below is a summary of the cancelled items:</p>
        
        <h3 style="color: #1e293b; font-size: 16px; font-weight: 600; margin: 0 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">Cancelled Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <th style="text-align: left; padding-bottom: 8px; font-size: 13px; color: #64748b; font-weight: 600;">Product</th>
              <th style="text-align: right; padding-bottom: 8px; font-size: 13px; color: #64748b; font-weight: 600;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 4px 0; color: #64748b;">Subtotal</td>
              <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: 600;">₹${subtotal}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; color: #64748b;">Shipping</td>
              <td style="padding: 4px 0; text-align: right; color: #1e293b; font-weight: 600;">₹${shipping}</td>
            </tr>
            <tr style="font-size: 16px; font-weight: 700; border-top: 1px dashed #e2e8f0;">
              <td style="padding: 12px 0 0 0; color: #1e293b;">Cancelled Total</td>
              <td style="padding: 12px 0 0 0; text-align: right; color: #e11d48;">₹${total}</td>
            </tr>
          </table>
        </div>

        ${refundHtml}
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0 0 8px 0;">If you have any questions or would like to request further assistance, please contact our support team.</p>
        <p style="color: #64748b; font-size: 13px; font-weight: 600; margin: 0;">ShopEase Inc.</p>
      </div>
    </div>
  `;

  const text = `Your order ${order._id} has been cancelled. Total amount: ₹${total}. ${
    order.isPaid ? "Since your order was paid, your refund will be processed back to your original payment method within 2-3 business days." : ""
  }`;

  await transporter.sendMail({
    from: `"ShopEase" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendOrderConfirmation, sendOtpEmail, sendOrderCancellation };
