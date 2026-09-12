import {connect} from "@/libs/helpers";
import mongoose from "mongoose";

export async function getImagesBucket() {
  await connect();
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db as any, {bucketName: 'images'});
}
