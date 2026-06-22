import IncomeModel from "./income.model.js";

// GET all income for the logged-in user
export const getIncome = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", source = "", sortBy = "date", order = "desc" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { userId: req.user.id };
    if (search) filter.title = { $regex: search, $options: "i" };
    if (source) filter.source = source;

    const sortOrder = order === "asc" ? 1 : -1;

    const [income, total] = await Promise.all([
      IncomeModel.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit)),
      IncomeModel.countDocuments(filter),
    ]);

    res.json({ income, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all income (no pagination) for export/reports
export const getAllIncome = async (req, res) => {
  try {
    const { startDate, endDate, source } = req.query;
    const filter = { userId: req.user.id };
    if (source) filter.source = source;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    const income = await IncomeModel.find(filter).sort({ date: -1 });
    res.json({ income });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create income
export const createIncome = async (req, res) => {
  try {
    const { title, amount, source, description, date } = req.body;
    const income = await IncomeModel.create({
      title,
      amount,
      source,
      description,
      date: date || new Date(),
      userId: req.user.id,
    });
    res.status(201).json({ message: "Income added successfully", income });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update income
export const updateIncome = async (req, res) => {
  try {
    const income = await IncomeModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!income) return res.status(404).json({ message: "Income not found" });
    res.json({ message: "Income updated", income });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE income
export const deleteIncome = async (req, res) => {
  try {
    const income = await IncomeModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!income) return res.status(404).json({ message: "Income not found" });
    res.json({ message: "Income deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
