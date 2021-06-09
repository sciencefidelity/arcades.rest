import { Schema, model, Model, Document } from 'mongoose'

export interface IUser extends Document {
  firstName: String
  lastName: String
  username: string
  email: string
  password: String
  avatar?: string
  created: string
}

interface IUserDoc extends Document, IUser {}

const UserSchema = new Schema({
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

export default model<IUserDoc>('User', UserSchema)
