import mongoose from "mongoose"
// Password length requirements: Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
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

  password: {
    type: String,
    required: true,
  },
})

export const User = mongoose.model("User", userSchema)
