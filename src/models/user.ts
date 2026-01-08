import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  name?: string;
  password?: string;
  emailVerified?: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  emailVerified: {
    type: Date,
  },
  privacy: {
    type: String,
    enum: ["public", "private"],
    default: "private",
  },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
