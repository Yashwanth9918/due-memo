import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
     
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const corsOption = { origin: true, credentials: true };

mongoose.set("strictQuery", false);

//  Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
    app.listen(port, async () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("MongoDB Connection Failed:", err);
    process.exit(1);
  }
}; 

// Middleware 
app.use(express.json());
app.use(cors(corsOption)); 
app.use(cookieParser());

// Routes
// console.log("User routes mounted at /api/v1/users"); 
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/clients", clientRoutes);             
app.use("/api/v1/transactions", transactionRoutes);
app.post("/api/v1/users/register", async (req, res) => {
  console.log(req.body); // Log the request body
});

// // Test API Route 
// app.get("/", (req, res) => {
//   res.send(" API is working!");
// });

// Connect to DB and Start the Server 
connectDB();
