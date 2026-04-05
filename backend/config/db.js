const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Record = require('../models/Record');

const demoUsers = [
  ['Admin User', 'admin@finance.com', 'admin123', 'admin'],
  ['Analyst User', 'analyst@finance.com', 'analyst123', 'analyst'],
  ['Viewer User', 'viewer@finance.com', 'viewer123', 'viewer'],
];

async function seedDemos() {
  for (const [name, email, plainPassword, role] of demoUsers) {
    const exists = await User.findOne({ email });
    if (exists) continue;
    await User.create({
      name,
      email,
      password: bcrypt.hashSync(plainPassword, 10),
      role,
      active: true,
    });
    console.log(`Seeded user: ${email}`);
  }

  const admin = await User.findOne({ email: 'admin@finance.com' });
  if (!admin) return;

  const count = await Record.countDocuments();
  if (count > 0) return;

  const samples = [
    { amount: 5000, type: 'income', category: 'Salary', date: '2026-04-01', notes: 'Monthly Salary', userId: admin._id },
    { amount: 1200, type: 'expense', category: 'Rent', date: '2026-04-02', notes: 'April Rent', userId: admin._id },
    { amount: 150, type: 'expense', category: 'Food', date: '2026-04-03', notes: 'Groceries', userId: admin._id },
  ];
  await Record.insertMany(samples);
  console.log('Sample records seeded');
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    throw new Error(
      'MONGODB_URI is missing. Add it in your host environment (Render: Dashboard → Environment → Environment Variables). Do not rely on a .env file in the repo.'
    );
  }
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15_000,
    });
  } catch (e) {
    const hint =
      'Check: (1) Atlas → Network Access allows 0.0.0.0/0 or Render outbound IPs, (2) user/password in URI are correct and special chars URL-encoded, (3) cluster host matches Atlas.';
    throw new Error(`${e.message || e}. ${hint}`);
  }
  console.log('MongoDB connected (users + financial records live in this database)');
  await seedDemos();
}

module.exports = { connectDB };
