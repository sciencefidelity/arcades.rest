import { Schema, model } from 'mongoose'

interface Arcade {
  convolute: {
    letter: string;
    title: string;
  },
  text: {
    p1?: string;
    p2?: string;
    p3?: string;
    p4?: string;
  }
  index: string
  tags: string[]
}

// interface IUserDoc extends Document, IUser {}

const ArcadesSchema = new Schema<Arcade>({
  convolute: {
    type: Object,
    required: true,
    strict: true
  },
  text: {
    type: Object,
    required: true,
    strict: true
  },
  index: {
    type: String,
    required: true,
    strict: true
  },
  tags: {
    type: Array,
    required: true,
    strict: true
  },
}, { timestamps: { createdAt: 'createdAt' }
})

export const arcadesModel = model<Arcade>('User', ArcadesSchema)
