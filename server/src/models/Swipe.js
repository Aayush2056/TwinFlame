import mongoose, { Schema } from 'mongoose';

const SwipeSchema = new Schema(
  {
    actorId: { type: String, required: true, index: true },
    targetProfileId: { type: String, required: true, index: true },
    action: { type: String, enum: ['like', 'pass'], required: true },
  },
  { timestamps: true }
);

// Prevent duplicate swipes by the same user on the same profile
SwipeSchema.index({ actorId: 1, targetProfileId: 1 }, { unique: true });

export const SwipeModel =
  mongoose.models.Swipe || mongoose.model('Swipe', SwipeSchema);
