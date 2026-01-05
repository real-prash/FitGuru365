import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    
    isProfileComplete: { type: Boolean, default: false },
    
    age: { type: Number },
    height: { type: Number },
    weight: { type: Number },
    
    fitnessGoal: { 
      type: String, 
      enum: ["lose_fat", "gain_muscle", "recomp"],
    },
    experience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    workoutFrequency: { type: Number, min: 2, max: 6 },

    // NEW: Store calculated targets here
    currentMacros: {
      calories: { type: Number, default: 2000 },
      protein: { type: Number, default: 150 },
      carbs: { type: Number, default: 200 },
      fat: { type: Number, default: 60 },
    },

    // UPDATE: Add adherence to history
    weightHistory: [
      {
        weight: Number,
        date: Date,
        dietAdherence: { type: Number, default: 100 }, // 0-100
        trainingAdherence: { type: Number, default: 100 }, // 0-100
      }
    ],
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;