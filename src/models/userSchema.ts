import * as mongoose from 'mongoose'

export interface IUser extends Document {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  avatar?: string
  created: string
}

interface IUserDoc extends Document, IUser {}

const UserSchema = new mongoose.Schema({
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

export const UserModel = mongoose.model<IUserDoc>('User', UserSchema)
