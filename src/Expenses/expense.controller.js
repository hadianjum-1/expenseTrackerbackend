import ExpenseModel from "./expense.model.js";

// GET all expenses for the logged-in user
export const getExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category = "", sortBy = "date", order = "desc" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { userId: req.user.id };
    if (search) filter.title = { $regex: search, $options: "i" };
    if (category) filter.category = category;

    const sortOrder = order === "asc" ? 1 : -1;

    const [expenses, total] = await Promise.all([
      ExpenseModel.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      ExpenseModel.countDocuments(filter),
    ]);

    res.json({ expenses, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all expenses (no pagination) for export/reports
export const getAllExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const filter = { userId: req.user.id };
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const expenses = await ExpenseModel.find(filter).sort({ date: -1 });
    res.json({ expenses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create expense
export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, description, date } = req.body;
    const expense = await ExpenseModel.create({
      title,
      amount,
      category,
      description,
      date: date || new Date(),
      userId: req.user.id,
    });
    res.status(201).json({ message: "Expense added successfully", expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await ExpenseModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense updated", expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await ExpenseModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
