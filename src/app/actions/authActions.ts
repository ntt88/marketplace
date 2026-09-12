'use server';

import {connect} from "@/libs/helpers";
import {UserModel} from "@/models/User";
import bcrypt from "bcryptjs";

export async function registerUser(email: string, password: string) {
  await connect();
  const existing = await UserModel.findOne({email});
  if (existing) {
    return {error: 'An account with this email already exists'};
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await UserModel.create({email, passwordHash});
  return {error: null};
}
