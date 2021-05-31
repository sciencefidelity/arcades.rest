import { Schema } from 'mongoose'

export interface User {
  username: string
  created: string
}

export const userSchema = new Schema<User>({
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  created: {
    type: Date,
    required: [true, 'Created date is required']
  }
})
