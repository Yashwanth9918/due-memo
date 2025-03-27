import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    phoneNumber: {
      type: String,
      unique:true,
      required: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"]
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Please enter a valid email address"
      ]
    },
    role: {
      type: String,
      enum: ["vendor", "customer"],
      required: true
    },
    clients: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client" 
    }],
    transactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction" 
    }]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
