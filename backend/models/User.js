import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  // Password length requirements: Password must be at least 8 characters
  password: {
    type: String,
    required: true,
  },
})

export const User = mongoose.model("User", userSchema)
