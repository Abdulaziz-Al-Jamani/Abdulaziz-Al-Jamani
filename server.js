// استدعاء الحزم
const express = require("express");
const cors = require("cors");
const app = express();

// تفعيل body parsing للـ JSON
app.use(express.json());

// حل مشكلة CORS
app.use(
  cors({
    origin: "https://sutwwa-11e6f.web.app", // ضع هنا رابط موقعك
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // لو تستخدم الكوكيز
  })
);

// مثال endpoint لإنشاء طلب بايبال
app.post("/api/paypal/create-order", async (req, res) => {
  try {
    // هنا ضع كود إنشاء الطلب باستخدام SDK بايبال
    // مثال:
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "10.00",
          },
        },
      ],
    };

    // افترض أن لديك كود بايبال هنا لإرجاع orderId
    // const orderId = await createPaypalOrder(order);
    const orderId = "FAKE_ORDER_ID"; // مؤقت للتجربة

    res.json({ id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "حدث خطأ عند إنشاء الطلب" });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
