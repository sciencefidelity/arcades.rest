import { Schema, model } from 'mongoose'

interface User {
  firstName: String
  lastName: String
  username: string
  email: string
  password: String
  avatar?: string
  created: string
}

const userSchema = new Schema<User>({
  firstName: {
    type: String,
    required: [true, 'first name is required'],
    strict: true
  },
  lastName: {
    type: String,
    required: [true, 'last name is required'],
    strict: true
  },
  username: {
    type: String,
    required: [true, 'username is required'],
    strict: true
  },
  email: {
    type: String,
    required: [true, 'email address is required'],
    strict: true
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    strict: true
  },
  avatar: String,
  created: {
    type: Date,
    required: true,
    strict: true
  }
})

export const userModel = model<User>('User', userSchema)
