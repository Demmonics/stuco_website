import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';

const siteConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'main_config',
    },
    googleFormUrl: {
      type: String,
      required: true,
      trim: true,
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      userId: String,
      email: String,
      role: String,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const SiteConfigModel = mongoose.model('SiteConfig', siteConfigSchema);

// In-memory fallback if MongoDB is not yet provisioned in dev
let memoryConfig = {
  key: 'main_config',
  googleFormUrl:
    process.env.INITIAL_GOOGLE_FORM_URL ||
    'https://docs.google.com/forms/d/e/1FAIpQLSedXlK3LEjnhzmK-MYlxT1kH8sscxsm9aZMcHIiBMzygT5raQ/viewform?embedded=true',
  registrationOpen: true,
  updatedBy: {
    userId: 'system',
    email: 'council@somaiya.edu',
    role: 'super_admin',
  },
  lastUpdated: new Date(),
};

export async function getSiteConfig() {
  if (isDbConnected()) {
    try {
      let config = await SiteConfigModel.findOne({ key: 'main_config' });
      if (!config) {
        config = await SiteConfigModel.create(memoryConfig);
      }
      return config;
    } catch (err) {
      console.warn('DB read fallback to memory config:', err.message);
    }
  }
  return memoryConfig;
}

export async function updateGoogleFormUrl(newUrl, userDetails) {
  const updates = {
    googleFormUrl: newUrl,
    updatedBy: userDetails,
    lastUpdated: new Date(),
  };

  if (isDbConnected()) {
    try {
      const updated = await SiteConfigModel.findOneAndUpdate(
        { key: 'main_config' },
        { $set: updates },
        { new: true, upsert: true }
      );
      memoryConfig = updated.toObject();
      return updated;
    } catch (err) {
      console.warn('DB update failed, updating memory store:', err.message);
    }
  }

  memoryConfig = {
    ...memoryConfig,
    ...updates,
  };
  return memoryConfig;
}
