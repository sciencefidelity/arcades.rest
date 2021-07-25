import { Schema, model } from "mongoose"

interface User {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  avatar?: string
}

const UserSchema = new Schema<User>(
  {
    firstName: {
      type: String,
      required: true,
      strict: true,
    },
    lastName: {
      type: String,
      required: true,
      strict: true,
    },
    username: {
      type: String,
      required: true,
      strict: true,
    },
    email: {
      type: String,
      required: true,
      strict: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      strict: true,
    },
    avatar: String,
  },
  { timestamps: { createdAt: "createdAt" } }
)

export const userModel = model<User>("User", UserSchema)
