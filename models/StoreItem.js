/**
 * Mongoose Model for Riyad Store Item / Bot Command
 */

const mongoose = require('mongoose');
const Counter = require('./Counter');

const storeItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Command name is required'],
      trim: true,
      index: true,
    },
    version: {
      type: String,
      default: '1.0.0',
      trim: true,
    },
    author: {
      type: String,
      default: 'Anonymous',
      trim: true,
      index: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    rawCode: {
      type: String,
      required: [true, 'Raw command JavaScript code is required'],
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Auto increment ID before saving
storeItemSchema.pre('save', async function (next) {
  if (this.isNew && !this.id) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'storeitemId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter.seq;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

// Text index for fast searching
storeItemSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  author: 'text',
});

const StoreItem = mongoose.models.StoreItem || mongoose.model('StoreItem', storeItemSchema);

module.exports = StoreItem;
