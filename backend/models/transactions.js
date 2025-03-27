import mongoose from "mongoose";


const transactionSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true
    },
    isPaid: {
      type: Boolean,
      default: false
    }
  }, { timestamps: true });
  
export default mongoose.model('Transaction', transactionSchema);

  
  