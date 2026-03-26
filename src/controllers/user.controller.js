import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

// UPDATE USER NAME
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required." });
    }

    if (name.length < 3 || name.length > 50) {
      return res
        .status(400)
        .json({ error: "Name must be between 3 and 50 characters." });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, updatedAt: Date.now() },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return res.status(400).json({ error: "Email already used" });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = password;
    }

    user.updatedAt = Date.now();

    const validationError = user.validateSync();
    if (validationError) {
      const errors = Object.values(validationError.errors).map(
        (e) => e.message,
      );
      return res.status(400).json({ error: errors });
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: errors });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already used" });
    }
    res.status(500).json({ error: err.message });
  }
};

// SEARCH USER BY EMAIL
export const searchByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res
        .status(400)
        .json({ error: "Email query parameter is required." });
    }

    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const userId = req.params.id || req.user._id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current password and new password are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, {
      password: hashed,
      updatedAt: Date.now(),
    });

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
