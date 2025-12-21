import User from "./User.js"; // make sure User.js exists in the same folder

// Upsert user by userId
export const upsertUser = async (userId, userData) => {
  const numericUserId = Number(userId);

  let user = await User.findOne({ userId: numericUserId });

  if (user) {
    Object.assign(user, userData);
    await user.save(); // triggers pre-save hooks
  } else {
    user = new User(userData);
    await user.save(); // pre-save assigns userId if not provided
  }

  return user;
};
