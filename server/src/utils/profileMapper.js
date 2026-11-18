/**
 * Strips private server-side flags (such as hasLikedCurrentUser)
 * before sending any profile payload to the client.
 */
export function toPublicProfile(profile) {
  return {
    id: profile.id || String(profile._id),
    slug: profile.slug,
    name: profile.name,
    age: profile.age,
    bio: profile.bio,
    city: profile.city,
    college: profile.college,
    interests: [...(profile.interests || [])],
    photo: {
      url: profile.photo?.url || '',
      publicId: profile.photo?.publicId || '',
    },
  };
}
