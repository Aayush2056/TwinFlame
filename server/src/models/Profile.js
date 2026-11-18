import mongoose, { Schema } from 'mongoose';

const ProfileSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 18, max: 99 },
    bio: { type: String, required: true, maxlength: 400 },
    city: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    interests: { type: [String], default: [] },
    photo: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    isActive: { type: Boolean, default: true, index: true },
    // Strictly private server-side flag; never exposed on feed or unreciprocated queries
    hasLikedCurrentUser: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

ProfileSchema.index({ isActive: 1, _id: 1 });

export const ProfileModel =
  mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
