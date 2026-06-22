import CategoryModel from "./category.model.js";

// GET all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ userId: req.user.id }).sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST create category
export const createCategory = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const existing = await CategoryModel.findOne({ name: { $regex: `^${name}$`, $options: "i" }, userId: req.user.id });
    if (existing) return res.status(400).json({ message: "Category already exists" });
    const category = await CategoryModel.create({ name, icon, color, userId: req.user.id });
    res.status(201).json({ message: "Category created", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update category
export const updateCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category updated", category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE category
export const deleteCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
