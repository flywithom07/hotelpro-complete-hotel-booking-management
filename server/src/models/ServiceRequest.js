import mongoose from 'mongoose';

const ServiceRequestSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    },
    roomNumber: {
      type: String,
      required: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    guestName: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Room Service', 'Extra Amenities', 'Luggage Assistance', 'Maintenance Issue', 'Concierge Booking', 'Wake-up Call'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['urgent', 'standard', 'low'],
      default: 'standard'
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'cancelled'],
      default: 'pending'
    },
    assignedStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    resolutionNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export default mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', ServiceRequestSchema);
