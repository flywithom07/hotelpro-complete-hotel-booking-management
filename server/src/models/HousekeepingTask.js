import mongoose from 'mongoose';

const HousekeepingTaskSchema = new mongoose.Schema(
  {
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
    roomNumber: {
      type: String,
      required: true
    },
    taskType: {
      type: String,
      enum: ['Turnover Clean', 'Daily Refresh', 'Deep Clean', 'Inspection', 'Linen Change'],
      default: 'Turnover Clean'
    },
    priority: {
      type: String,
      enum: ['high', 'standard', 'low'],
      default: 'standard'
    },
    status: {
      type: String,
      enum: ['Dirty', 'Cleaning', 'Inspected', 'Ready'],
      default: 'Dirty'
    },
    assignedStaffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    assignedStaffName: {
      type: String,
      default: 'Unassigned'
    },
    notes: {
      type: String,
      default: ''
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.models.HousekeepingTask || mongoose.model('HousekeepingTask', HousekeepingTaskSchema);
