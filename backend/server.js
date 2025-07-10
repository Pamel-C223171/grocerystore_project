// server.js
//--------------------------------------------------
const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const connectDB = require('./config/db');   // ✅ DB connect ফাংশন
const authRoutes = require('./routes/auth'); // ✅ Routes

//--------------------------------------------------
// ENV কনফিগ লোড + DB কানেকশন
//--------------------------------------------------
dotenv.config();
connectDB(); // 🔥 MongoDB connect এখানেই কল

//--------------------------------------------------
// Express App সেটআপ
//--------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

//--------------------------------------------------
// Server Start
//--------------------------------------------------
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
