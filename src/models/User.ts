import {Model, model, models, Schema} from "mongoose";

export type User = {
  _id: string;
  email: string;
  passwordHash: string;
};

const userSchema = new Schema<User>({
  email: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true},
}, {
  timestamps: true,
});

export const UserModel = (models?.User as Model<User>) || model<User>('User', userSchema);
