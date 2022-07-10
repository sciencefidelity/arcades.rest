import { model, Document, Schema } from "mongoose";

export interface IArcade extends Document {
  convolute: {
    letter: string;
    title: string;
  };
  text?: {
    p1?: string;
    p2?: string;
  };
  index: string;
  tags?: string[];
}

export const ArcadesSchema: Schema = new Schema(
  {
    convolute: {
      type: Object,
      required: true,
      strict: true,
    },
    text: {
      type: Object,
      strict: true,
    },
    index: {
      type: String,
      required: true,
      strict: true,
    },
    tags: {
      type: Array,
      strict: true,
    },
  },
  { timestamps: { createdAt: "createdAt" } }
);

export const Arcade = model<IArcade>("Arcade", ArcadesSchema);
