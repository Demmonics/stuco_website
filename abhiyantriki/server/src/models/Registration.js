import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxLength: 120,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxLength: 20,
    },
    college: {
      type: String,
      required: true,
      trim: true,
      default: 'KJSCE',
      maxLength: 100,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
      maxLength: 30,
    },
    status: {
      type: String,
      enum: ['confirmed', 'waitlisted', 'cancelled'],
      default: 'confirmed',
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'registeredAt', updatedAt: true },
  }
);

// Compound index to avoid duplicate registrations per event
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export const RegistrationModel = mongoose.model('Registration', registrationSchema);

// In-memory fallback registrations
const memoryRegistrations = [];

export async function createRegistration(data) {
  if (isDbConnected()) {
    return await RegistrationModel.create(data);
  }
  const reg = {
    ...data,
    _id: `mem-reg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    registeredAt: new Date(),
  };
  memoryRegistrations.push(reg);
  return reg;
}

export async function findRegistrationsByUser(userId, limit = 50) {
  if (isDbConnected()) {
    return await RegistrationModel.find({ userId }).sort({ registeredAt: -1 }).limit(limit).lean();
  }
  return memoryRegistrations.filter((r) => r.userId === userId).slice(0, limit);
}

export async function findAllRegistrationsAdmin({ eventId, page = 1, limit = 50 } = {}) {
  const cappedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
  const skip = (Math.max(parseInt(page, 10) || 1, 1) - 1) * cappedLimit;

  if (isDbConnected()) {
    const filter = eventId ? { eventId } : {};
    const total = await RegistrationModel.countDocuments(filter);
    const records = await RegistrationModel.find(filter)
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(cappedLimit)
      .lean();
    return { records, total, page: Number(page), totalPages: Math.ceil(total / cappedLimit) };
  }

  let filtered = memoryRegistrations;
  if (eventId) filtered = filtered.filter((r) => r.eventId === eventId);
  const total = filtered.length;
  const records = filtered.slice(skip, skip + cappedLimit);
  return { records, total, page: Number(page), totalPages: Math.ceil(total / cappedLimit) };
}
