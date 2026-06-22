import Usermodel from "../Users/user.model.js";
import bcrypt from "bcrypt";

// GET profile
export const getProfile = async (req, res) => {
  try {
    const user = await Usermodel.findById(req.user.id).select("-password -otp");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT update profile (name, email, avatar)
export const updateProfile = async (req, res) => {
  try {
    const { Name, Email, avatar } = req.body;
    const updateFields = {};
    if (Name) updateFields.Name = Name;
    if (Email) updateFields.Email = Email;
    if (avatar) updateFields.avatar = avatar;

    const user = await Usermodel.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
    }).select("-password -otp");

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await Usermodel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
