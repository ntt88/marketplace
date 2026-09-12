import {getImagesBucket} from "@/libs/gridfs";
import mongoose from "mongoose";

export async function GET(req: Request, {params}: {params: {id: string}}) {
  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(params.id);
  } catch {
    return new Response('Not found', {status: 404});
  }

  const bucket = await getImagesBucket();
  const files = await bucket.find({_id: objectId}).toArray();
  if (files.length === 0) {
    return new Response('Not found', {status: 404});
  }

  const chunks: Buffer[] = [];
  const downloadStream = bucket.openDownloadStream(objectId);
  for await (const chunk of downloadStream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  return new Response(buffer, {
    headers: {
      'Content-Type': files[0].contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
