import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      index: true
    },
    bookingReference: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    provider: {
      type: String,
      enum: ['demo_card', 'stripe', 'razorpay', 'cash_at_desk'],
      default: 'demo_card'
    },
    providerOrderId: {
      type: String,
      default: ''
    },
    providerPaymentId: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'refunded', 'failed'],
      default: 'succeeded'
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true
    }
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
