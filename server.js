const express = require("express");
const cors = require("cors");
const app = express();
const paypalClient = require("./paypalClient");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

app.use(express.json());

app.use(
  cors({
    origin: "https://sutwwa-11e6f.web.app", // رابط موقعك
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// دالة لإنشاء طلب الدفع
async function createPaypalOrder(orderData) {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody(orderData);
  const response = await paypalClient.execute(request);
  return response.result.id; // orderId الحقيقي
}

// Endpoint لإنشاء طلب
app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const { amount = "1.00" } = req.body; // اجعل المبلغ ديناميكي من frontend
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
      application_context: {
    shipping_preference: "NO_SHIPPING" // يمنع طلب عنوان الشحن
  },
    };

    const orderId = await createPaypalOrder(order);
    res.json({ id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "حدث خطأ عند إنشاء الطلب" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
