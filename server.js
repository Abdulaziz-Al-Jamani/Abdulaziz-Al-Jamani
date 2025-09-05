import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import paypalRoutes from "./routes/paypal.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://abdulaziz-al-jamani.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

// ربط الراوتر
app.use("/api/paypal", paypalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
