// backend/data/importUsersFixed.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import SecurityRole from "../models/SecurityRole.js";
import Counter from "../models/Counter.js";
import { readFile } from "fs/promises";
import path from "path";

dotenv.config();
await connectDB();

const CLEAR_EXISTING_USERS = false; // set true only if you want to wipe Atlas users before importing

const importUsersFixed = async () => {
  try {
    console.log("🌍 Importing users into MongoDB Atlas...");

    const exportPath = path.resolve(process.cwd(), "users-export.json");
    const usersData = JSON.parse(await readFile(exportPath, "utf8"));

    console.log(`📥 Found ${usersData.length} users to import`);

    // Map role names -> _id (for primaryRole / selectedRoles)
    const roles = await SecurityRole.find({}).lean();
    const roleNameToId = new Map(roles.map((r) => [r.name, r._id]));

    if (CLEAR_EXISTING_USERS) {
      await User.deleteMany({});
      console.log("🗑️  Cleared existing users in Atlas");
    }

    // Compute next numeric userId
    const maxUser = await User.findOne().sort({ userId: -1 }).select("userId").lean();
    let nextUserId = maxUser?.userId || 0;

    let importedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const raw of usersData) {
      try {
        const userObj = raw?.toObject ? raw.toObject() : raw;

        // Skip if already exists by email
        const existing = await User.findOne({ email: userObj.email }).select("_id").lean();
        if (existing) {
          console.log(`⏭️  Skipped (exists): ${userObj.name} (${userObj.email})`);
          skippedCount += 1;
          continue;
        }

        // Remove fields that should not be copied as-is
        delete userObj._id;
        delete userObj.__v;

        // Ensure numeric userId (unique)
        nextUserId += 1;
        userObj.userId = nextUserId;

        // Map primaryRole if it is an object with name
        if (userObj.primaryRole && typeof userObj.primaryRole === "object") {
          const roleName = userObj.primaryRole.name;
          userObj.primaryRole = roleNameToId.get(roleName) || null;
        }

        // Map selectedRoles if present (array of objects with name)
        if (Array.isArray(userObj.selectedRoles)) {
          userObj.selectedRoles = userObj.selectedRoles
            .map((r) => {
              if (r && typeof r === "object" && r.name) return roleNameToId.get(r.name) || null;
              return r; // keep as-is if already ObjectId
            })
            .filter(Boolean);
        }

        // IMPORTANT: use raw insert to avoid re-hashing password in pre("save")
        await User.collection.insertOne(userObj);

        console.log(`✅ Imported: ${userObj.name} (${userObj.email}) [userId=${userObj.userId}]`);
        importedCount += 1;
      } catch (err) {
        console.error(`❌ Failed to import ${raw?.name || raw?.email || "user"}: ${err.message}`);
        failedCount += 1;
      }
    }

    // Keep Counter in sync for future user registrations (auto-increment)
    await Counter.findOneAndUpdate(
      { id: "userId" },
      { $set: { seq: nextUserId } },
      { upsert: true, new: true }
    );

    console.log("\n✨ User import complete!");
    console.log(`  - Imported: ${importedCount}`);
    console.log(`  - Skipped:  ${skippedCount}`);
    console.log(`  - Failed:   ${failedCount}`);
    console.log(`  - Counter userId seq set to: ${nextUserId}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Import error:", error);
    process.exit(1);
  }
};

importUsersFixed();