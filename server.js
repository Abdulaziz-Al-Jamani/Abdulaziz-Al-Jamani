const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", // أثناء التطوير
      "https://sutwwa-11e6f.web.app", // موقعك على Firebase
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
