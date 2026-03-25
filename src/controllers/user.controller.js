import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

// UPDATE USER INFO
export const updateUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
      return res
        .status(400)
        .json({ error: "At least one field is required to update." });
    }

    const user = await User.findById(userId);
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
