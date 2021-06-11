import { Schema, model } from 'mongoose'

interface Arcade {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  avatar?: string
}

// interface IUserDoc extends Document, IUser {}

const ArcadesSchema = new Schema<Arcade>({
  firstName: {
    type: String,
    required: true,
    strict: true
  },
  lastName: {
    type: String,
    required: true,
    strict: true
  },
  username: {
    type: String,
    required: true,
    strict: true
  },
  email: {
    type: String,
    required: true,
    strict: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    strict: true
  },
  avatar: String
}, { timestamps: { createdAt: 'createdAt' }
})

export const userModel = model<Arcade>('User', ArcadesSchema)
