import { Schema, model, Document } from 'mongoose'

export interface User extends Document {
  firstName: String
  lastName: String
  username: string
  email: string
  password: String
  avatar?: string
  created: string
}

const userSchema = new Schema<User>({
  firstName: String,
  lastName: String,
  username: String,
  email: {
    type: String,
    trim: true
  },
  password: String,
  avatar: String,
  created: Date
})

export const userModel = model<User & Document>('User', userSchema)
