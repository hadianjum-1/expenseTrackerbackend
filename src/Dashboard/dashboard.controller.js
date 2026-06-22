import ExpenseModel from "../Expenses/expense.model.js";
import IncomeModel from "../Income/income.model.js";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// GET /dashboard/stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [expenses, income] = await Promise.all([
      ExpenseModel.find({ userId }),
      IncomeModel.find({ userId }),
    ]);

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalBalance = totalIncome - totalExpense;
    const savings = totalBalance > 0 ? totalBalance : 0;

    res.json({ totalBalance, totalIncome, totalExpense, savings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /dashboard/charts
export const getDashboardCharts = async (req, res) => {
  try {
    const userId = req.user.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const [expenses, income] = await Promise.all([
      ExpenseModel.find({ userId, date: { $gte: startOfYear, $lte: endOfYear } }),
      IncomeModel.find({ userId, date: { $gte: startOfYear, $lte: endOfYear } }),
    ]);

    // Monthly expense line chart data
    const monthlyExpenses = MONTHS.map((month, i) => ({
      month,
      amount: expenses
        .filter((e) => new Date(e.date).getMonth() === i)
        .reduce((sum, e) => sum + e.amount, 0),
    }));

    // Income vs Expense bar chart
    const incomeVsExpense = MONTHS.map((month, i) => ({
      month,
      income: income
        .filter((inc) => new Date(inc.date).getMonth() === i)
        .reduce((sum, inc) => sum + inc.amount, 0),
      expense: expenses
        .filter((e) => new Date(e.date).getMonth() === i)
        .reduce((sum, e) => sum + e.amount, 0),
    }));

    // Category breakdown for pie chart
    const categoryMap = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });
    const categoryBreakdown = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));

    // Weekly trend (last 7 days) area chart
    const now = new Date();
    const weeklyTrend = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - i));
      const dayStr = day.toLocaleDateString("en-US", { weekday: "short" });
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(day.setHours(23, 59, 59, 999));
      return {
        day: dayStr,
        amount: expenses
          .filter((e) => {
            const d = new Date(e.date);
            return d >= dayStart && d <= dayEnd;
          })
          .reduce((sum, e) => sum + e.amount, 0),
      };
    });

    res.json({ monthlyExpenses, incomeVsExpense, categoryBreakdown, weeklyTrend });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
