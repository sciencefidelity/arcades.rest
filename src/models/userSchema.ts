import { model, Model, Document, Schema } from "mongoose"

interface IUser extends Document {
	firstName: string
	lastName: string
	username: string
	email: string
	password: string
	avatar?: string
}

const UserSchema: Schema = new Schema(
	{
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
	},
	{ timestamps: { createdAt: "createdAt" } }
)

export const User: Model<IUser> = model("User", UserSchema)
