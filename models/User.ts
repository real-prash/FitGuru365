import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    //Auth
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    //Profile Info
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    isProfileComplete: { type: Boolean, default: false },

    //Body Metrics
    age: { type: Number },
    height: { type: Number }, // cm
    weight: { type: Number }, // kg

    //Fitness
    fitnessGoal: { type: String }, // lose_fat | gain_muscle | recomp
    experience: { type: String },  // beginner | intermediate | advanced
    workoutFrequency: { type: Number },

    //Current Macros
    currentMacros: {
      calories: { type: Number, default: 2000 },
      protein: { type: Number, default: 150 },
      carbs: { type: Number, default: 200 },
      fat: { type: Number, default: 60 },
    },

    //Weight Tracking
    weightHistory: [
      {
        weight: { type: Number },
        date: { type: Date, default: Date.now },
        dietAdherence: { type: Number, default: 100 },
        trainingAdherence: { type: Number, default: 100 },
      },
    ],

    //Diet Preferences
    dietPreferences: {
      restrictions: { type: String, default: "" }, // Vegetarian, Vegan, etc.
      allergies: { type: String, default: "" },
      favorites: { type: String, default: "" },
    },

    //AI-Generated Diet Plan (Gemini Output)
    lastDietGenerated: { type: Date, default: null },

    dietPlan: {
      type: Schema.Types.Mixed, // Stores full flexible JSON
      default: null,
    },
    lastWorkoutGenerated: { type: Date, default: null },
    workoutPlan: {
      type: Schema.Types.Mixed, // Stores the full JSON routine
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

//Prevent model overwrite in Next.js hot reload
const User = models.User || model("User", UserSchema);

export default User;
