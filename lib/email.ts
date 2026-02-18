import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
})

interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface OrderEmailData {
  userName: string
  userEmail: string
  items: OrderItem[]
  totalPrice: number
  orderDate: Date
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const { userName, userEmail, items, totalPrice, orderDate } = data

  const itemRows = items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px;">${item.name}</td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join("")

  const formattedDate = new Date(orderDate).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  })

  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="background: #ea580c; padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Order Confirmed!</h1>
      </div>
      <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="font-size: 16px; color: #374151;">Hi <strong>${userName}</strong>,</p>
        <p style="font-size: 14px; color: #6b7280;">Thank you for your order! Here are your order details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #fef3c7;">
              <th style="padding: 10px 16px; text-align: left; font-size: 13px; font-weight: 600; color: #92400e;">Item</th>
              <th style="padding: 10px 16px; text-align: center; font-size: 13px; font-weight: 600; color: #92400e;">Qty</th>
              <th style="padding: 10px 16px; text-align: right; font-size: 13px; font-weight: 600; color: #92400e;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>
        
        <div style="background: #fff7ed; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #ea580c; text-align: right;">
            Total: $${totalPrice.toFixed(2)}
          </p>
        </div>
        
        <p style="font-size: 13px; color: #9ca3af; margin-top: 20px;">
          Order Date: ${formattedDate}
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">
          FoodHub - Fresh food delivered to your door
        </p>
      </div>
    </div>
  `

  await transporter.sendMail({
    from: `"FoodHub" <${process.env.EMAIL_FROM}>`,
    to: userEmail,
    subject: `Order Confirmation - FoodHub`,
    html,
  })
}
