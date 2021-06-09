import * as mongoose from 'mongoose'

export interface IUser extends Document {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  avatar?: string
  created: Date
}

// interface IUserDoc extends Document, IUser {}

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: String,
  created: {
    type: Date,
    required: true
  }
})

export default mongoose.model<IUser>('User', UserSchema)
