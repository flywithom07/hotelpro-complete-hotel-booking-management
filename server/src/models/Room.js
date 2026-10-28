import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['Deluxe King', 'Ocean View Suite', 'Presidential Penthouse', 'Executive Club Room', 'Junior Suite', 'Garden Villa'],
      required: true
    },
    capacity: {
      adults: { type: Number, default: 2 },
      children: { type: Number, default: 1 }
    },
    bedType: {
      type: String,
      default: 'King'
    },
    sizeSqFt: {
      type: Number,
      default: 450
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    amenities: [
      {
        type: String
      }
    ],
    operationalStatus: {
      type: String,
      enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
      default: 'Available'
    },
    images: [
      {
        type: String
      }
    ],
    floor: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

// Ensure unique room numbers per hotel
RoomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
