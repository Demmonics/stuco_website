import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      required: true,
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: 'Unknown',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Insert-only, no updatedAt
  }
);

// Prevent updates and deletions at mongoose schema level for immutability
auditLogSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate', 'deleteOne', 'deleteMany', 'findOneAndDelete'], function () {
  throw new Error('Audit logs are strictly insert-only and cannot be modified or deleted.');
});

export const AuditLogModel = mongoose.model('AuditLog', auditLogSchema);

// In-memory fallback ring buffer (last 100 logs)
const memoryAuditLogs = [];

export async function createAuditEntry({ action, userId, userEmail, userRole, oldValue, newValue, ipAddress, userAgent, metadata }) {
  const entry = {
    action,
    userId,
    userEmail,
    userRole,
    oldValue,
    newValue,
    ipAddress,
    userAgent,
    metadata,
    createdAt: new Date(),
  };

  if (isDbConnected()) {
    try {
      const doc = await AuditLogModel.create(entry);
      return doc;
    } catch (err) {
      console.warn('DB audit log write failed, appending to memory buffer:', err.message);
    }
  }

  memoryAuditLogs.unshift(entry);
  if (memoryAuditLogs.length > 100) memoryAuditLogs.pop();
  return entry;
}

export async function getRecentAuditLogs(limit = 20) {
  if (isDbConnected()) {
    try {
      return await AuditLogModel.find().sort({ createdAt: -1 }).limit(limit).lean();
    } catch (err) {
      console.warn('DB audit logs read failed, falling back to memory buffer:', err.message);
    }
  }
  return memoryAuditLogs.slice(0, limit);
}
