import mongoose from 'mongoose';

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide hotel name'],
      trim: true,
      maxlength: 120
    },
    tagline: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: [true, 'Please provide description']
    },
    address: {
      type: String,
      required: [true, 'Please provide address']
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      index: true
    },
    state: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      default: 'United States'
    },
    postalCode: {
      type: String,
      default: ''
    },
    starRating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5
    },
    reviewAverage: {
      type: Number,
      default: 4.8
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    amenities: [
      {
        type: String
      }
    ],
    images: [
      {
        type: String
      }
    ],
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'maintenance', 'unlisted'],
      default: 'active'
    },
    policies: {
      checkInTime: { type: String, default: '15:00' },
      checkOutTime: { type: String, default: '11:00' },
      cancellationDays: { type: Number, default: 2 },
      petFriendly: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

export default mongoose.models.Hotel || mongoose.model('Hotel', HotelSchema);
