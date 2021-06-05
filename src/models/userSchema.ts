import mongoose from 'mongoose'

const { Schema } = mongoose

mongoose.Promise = global.Promise

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

export default mongoose.model('User', userSchema)
