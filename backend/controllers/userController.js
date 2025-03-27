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
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true });
    res.json({ msg: "Login successful", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

