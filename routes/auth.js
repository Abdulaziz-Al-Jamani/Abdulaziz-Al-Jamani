const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db/database");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ msg: "جميع الحقول مطلوبة" });

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id`,
      [username, email, hash]
    );
    const userId = result.rows[0].id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: { id: userId, username, email } });
  } catch (err) {
    console.error("❌ خطأ في التسجيل:", err.message);
    res.status(400).json({ msg: "المستخدم موجود بالفعل أو حدث خطأ" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "يرجى إدخال البريد وكلمة المرور" });

  try {
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ msg: "بيانات الدخول غير صحيحة" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "بيانات الدخول غير صحيحة" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("❌ خطأ في تسجيل الدخول:", err.message);
    res.status(500).json({ msg: "فشل في تسجيل الدخول" });
  }
});

router.put("/update", authMiddleware, async (req, res) => {
  const { username } = req.body;
  if (!username)
    return res.status(400).json({ msg: "يرجى إدخال الاسم الجديد" });

  try {
    await db.query(`UPDATE users SET username = $1 WHERE id = $2`, [
      username,
      req.user.userId,
    ]);
    res.json({ msg: "تم التحديث بنجاح" });
  } catch (err) {
    console.error("❌ خطأ في التحديث:", err.message);
    res.status(500).json({ msg: "فشل في التحديث" });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, username, email FROM users WHERE id = $1`,
      [req.user.userId]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ msg: "المستخدم غير موجود" });
    res.json(user);
  } catch (err) {
    console.error("❌ خطأ في استرجاع البيانات:", err.message);
    res.status(500).json({ msg: "فشل في تحميل البيانات" });
  }
});

module.exports = router;
