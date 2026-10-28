import mongoose from 'mongoose';

const AdminLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    actorName: {
      type: String,
      required: true
    },
    actorRole: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    targetEntity: {
      type: String,
      required: true
    },
    targetId: {
      type: String,
      default: ''
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: '127.0.0.1'
    }
  },
  { timestamps: true }
);

export default mongoose.models.AdminLog || mongoose.model('AdminLog', AdminLogSchema);
