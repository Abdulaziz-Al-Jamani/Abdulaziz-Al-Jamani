// استدعاء الحزم
const express = require("express");
const cors = require("cors");
const app = express();
const paypalClient = require("./paypalClient");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

// تفعيل body parsing للـ JSON
app.use(express.json());

async function createPaypalOrder(orderData) {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation"); // يرجع تفاصيل الطلب
  request.requestBody(orderData);

  const response = await paypalClient.execute(request);
  return response.result.id; // هذا هو orderId
}

// حل مشكلة CORS
app.use(
  cors({
    origin: "https://sutwwa-11e6f.web.app", // رابط موقعك على Firebase
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());
// مثال endpoint لإنشاء طلب بايبال
app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "10.00", // أو اجعلها ديناميكية من req.body
          },
        },
      ],
    };

    const orderId = await createPaypalOrder(order);
    res.json({ id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "حدث خطأ عند إنشاء الطلب" });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
