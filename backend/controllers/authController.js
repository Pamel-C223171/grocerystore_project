// controllers/authController.js
//--------------------------------------------------
// সব প্রয়োজনীয় মডিউল ইমপোর্ট
//--------------------------------------------------
const User   = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

//--------------------------------------------------
//  POST /api/auth/signup   ➜ register()
//--------------------------------------------------
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1) ফিল্ড ভ্যালিডেশন
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2) ইমেইল ডুপ্লিকেট চেক
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3) পাসওয়ার্ড হ্যাশ + নতুন ইউজার সেভ
    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed });

    // 4) সফল রেসপন্স
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('🚨 Signup Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//--------------------------------------------------
//  POST /api/auth/login   ➜ login()
//--------------------------------------------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1) ইউজার এক্সিস্টস?
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 2) পাসওয়ার্ড ম্যাচ?
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3) JWT টোকেন তৈরি
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    // 4) সফল রেসপন্স
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('🚨 Login Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
