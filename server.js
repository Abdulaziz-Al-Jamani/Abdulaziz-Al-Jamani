const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const paypal = require("@paypal/checkout-server-sdk");

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// إعداد PayPal
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Endpoint لإنشاء الطلب
app.post("/api/paypal/create-order", async (req, res) => {
  try {
    const { cartItems } = req.body;
    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        { amount: { currency_code: "USD", value: total.toFixed(2) } },
      ],
    });

    const order = await paypalClient.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    console.error("PayPal create order error:", err);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
