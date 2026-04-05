const mongoose = require('mongoose');
const Record = require('../models/Record');

exports.getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate } = req.query;
    const filter = {};

    if (type && type !== 'all') filter.type = type;
    if (category && category !== 'Other') filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = startDate;
      if (endDate) filter.date.$lte = endDate;
    }

    const rows = await Record.find(filter).sort({ date: -1 }).lean();
    const payload = rows.map((r) => ({
      id: r._id.toString(),
      amount: r.amount,
      type: r.type,
      category: r.category,
      date: r.date,
      notes: r.notes,
      userId: r.userId?.toString?.(),
    }));
    res.json(payload);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching records' });
  }
};

exports.addRecord = async (req, res) => {
  try {
    const { amount, type, category, date, notes } = req.body;
    const userId = req.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user' });
    }
    const doc = await Record.create({
      amount: Number(amount),
      type,
      category,
      date,
      notes: notes || '',
      userId,
    });
    res.status(201).json({
      id: doc._id.toString(),
      amount: doc.amount,
      type: doc.type,
      category: doc.category,
      date: doc.date,
      notes: doc.notes,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error adding record' });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid record id' });
    }
    const result = await Record.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: 'Record not found' });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting record' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const records = await Record.find().lean();

    const income = records.filter((r) => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
    const expenses = records.filter((r) => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);

    const categories = {};
    records
      .filter((r) => r.type === 'expense')
      .forEach((r) => {
        categories[r.category] = (categories[r.category] || 0) + r.amount;
      });
    const categoryData = Object.keys(categories).map((name) => ({ name, value: categories[name] }));

    const dailyData = {};
    records.forEach((r) => {
      if (!dailyData[r.date]) dailyData[r.date] = { date: r.date, income: 0, expense: 0 };
      if (r.type === 'income') dailyData[r.date].income += Number(r.amount);
      else dailyData[r.date].expense += Number(r.amount);
    });
    const trendData = Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));

    const sorted = [...records].sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentActivity = sorted.slice(0, 5).map((r) => ({
      id: r._id.toString(),
      amount: r.amount,
      type: r.type,
      category: r.category,
      date: r.date,
      notes: r.notes,
      userId: r.userId?.toString?.(),
    }));

    res.json({
      summary: { income, expenses, balance: income - expenses },
      categoryData,
      trendData,
      recentActivity,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};
