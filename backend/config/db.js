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
  // Only seed if the database is mostly empty (e.g. less than 10 records)
  if (count > 10) return;

  const samples = [
    // Income
    { amount: 14500, type: 'income', category: 'Software Consulting', date: '2026-04-01', notes: 'Phase 1 - Client Project A', userId: admin._id },
    { amount: 5800, type: 'income', category: 'SaaS Subscriptions', date: '2026-04-05', notes: 'Monthly recurring revenue', userId: admin._id },
    { amount: 12000, type: 'income', category: 'Project Completion Bonus', date: '2026-04-10', notes: 'Successful deployment bonus', userId: admin._id },
    { amount: 2400, type: 'income', category: 'Digital Marketplace Sales', date: '2026-03-28', notes: 'Marketplace product sales', userId: admin._id },
    
    // Expenses - Office & Infrastructure
    { amount: 3200, type: 'expense', category: 'Office Rent', date: '2026-04-01', notes: 'City Center Hub Rent', userId: admin._id },
    { amount: 480, type: 'expense', category: 'AWS Cloud Hosting', date: '2026-04-02', notes: 'Infrastructure scaling cost', userId: admin._id },
    { amount: 120, type: 'expense', category: 'Workspace Utilities', date: '2026-04-03', notes: 'Internet and Electricity', userId: admin._id },
    { amount: 2500, type: 'expense', category: 'Hardware Upgrade', date: '2026-03-25', notes: 'New developer laptops (MacBook Pro)', userId: admin._id },
    
    // Expenses - Operations
    { amount: 8500, type: 'expense', category: 'Employee Payroll', date: '2026-03-31', notes: 'March Salary Disbursements', userId: admin._id },
    { amount: 1250, type: 'expense', category: 'Marketing Campaign', date: '2026-04-08', notes: 'LinkedIn Ads for New Product', userId: admin._id },
    { amount: 310, type: 'expense', category: 'SaaS Tools', date: '2026-04-07', notes: 'Adobe, Figma, and Slack subscriptions', userId: admin._id },
    { amount: 180, type: 'expense', category: 'Office Supplies', date: '2026-04-06', notes: 'Stationery and generic inventory', userId: admin._id },
    { amount: 750, type: 'expense', category: 'Legal & Accounting', date: '2026-04-04', notes: 'Q1 audit and bookkeeping', userId: admin._id },
    { amount: 95, type: 'expense', category: 'Team Coffee/Snacks', date: '2026-04-09', notes: 'Common area pantry restock', userId: admin._id },
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
