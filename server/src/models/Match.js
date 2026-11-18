import mongoose, { Schema } from 'mongoose';

const MatchSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    matchedProfileId: { type: String, required: true },
    matchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Prevent duplicate matches and accelerate sorted match lookups
MatchSchema.index({ userId: 1, matchedProfileId: 1 }, { unique: true });
MatchSchema.index({ userId: 1, matchedAt: -1 });

export const MatchModel =
  mongoose.models.Match || mongoose.model('Match', MatchSchema);
