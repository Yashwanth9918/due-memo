import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

export const registerUser = async (req, res) => {
  const { username, email, phoneNumber, password, role } = req.body;


  try {
    //validating inputs
    if (!username || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }
 
    if (!validator.isEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    if (!validator.isMobilePhone(phoneNumber, "any")) {
      return res.status(400).json({ msg: "Invalid phone number" });
    }
    //checking if already exists
    let user = await User.findOne({ email , phoneNumber });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, phoneNumber, password: hashedPassword, role });
    await user.save(); 

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// export const help=(req,res)=>{
//   res.send("work");
// };

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({ msg: "Email, password, and role are required" });
    }

    // Find user by email and role
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set HttpOnly Cookie
    res.cookie("token", token, { httpOnly: true });
    res.json({ msg: "Login successful", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};


export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};