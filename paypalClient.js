const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

// اختَر البيئة: Sandbox للاختبار، Live للإنتاج
const environment = new checkoutNodeJssdk.core.LiveEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);

const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);

module.exports = client;
