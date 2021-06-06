import { Schema, model } from 'mongoose'

interface User {
  username: string
  email: string
  avatar?: string
  created: string
}

const userSchema = new Schema<User>({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  avatar: String,
  created: {
    type: Date,
    required: [true, 'Created date is required']
  }
})

export const userModel = model<User>('User', userSchema)