import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    guestName: {
      type: String,
      required: true
    },
    guestEmail: {
      type: String,
      required: true
    },
    guestPhone: {
      type: String,
      default: ''
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true
    },
    checkIn: {
      type: String, // YYYY-MM-DD
      required: true
    },
    checkOut: {
      type: String, // YYYY-MM-DD
      required: true
    },
    nights: {
      type: Number,
      required: true
    },
    guests: {
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 0 }
    },
    numberOfRooms: {
      type: Number,
      default: 1
    },
    priceBreakdown: {
      basePricePerNight: Number,
      roomRateSubtotal: Number,
      discountPercent: Number,
      discountAmount: Number,
      taxRate: Number,
      taxAmount: Number,
      resortFee: Number,
      totalAmount: Number,
      currency: { type: String, default: 'USD' }
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'checked_in', 'checked_out', 'cancelled'],
      default: 'confirmed',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'paid'
    },
    specialRequests: {
      type: String,
      default: ''
    },
    checkInTimestamp: {
      type: Date,
      default: null
    },
    checkOutTimestamp: {
      type: Date,
      default: null
    },
    cancellationReason: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Compound index to accelerate date-range availability queries
BookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1, bookingStatus: 1 });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
