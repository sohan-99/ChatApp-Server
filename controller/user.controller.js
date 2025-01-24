import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;

    if (!name || !email || !password || !confirmpassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      confirmpassword: hashedPassword,  // Store hashed password in both fields
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
    // console.log(req.body);  // Debug request body

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
