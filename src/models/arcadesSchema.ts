import { Schema, model } from 'mongoose'

interface Arcade {
  convolute: {
    letter: string;
    title: string
  },
  text?: {
    p1?: string;
    p2?: string
  }
  index: string
  tags?: string[]
}

const ArcadesSchema = new Schema<Arcade>({
  convolute: {
    type: Object,
    required: true,
    strict: true
  },
  text: {
    type: Object,
    strict: true
  },
  index: {
    type: String,
    required: true,
    strict: true
  },
  tags: {
    type: Array,
    strict: true
  },
}, { timestamps: { createdAt: 'createdAt' }
})

export const arcadesModel = model<Arcade>('Arcade', ArcadesSchema)
