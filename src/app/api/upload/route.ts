import {authOptions} from "@/libs/authOptions";
import {getImagesBucket} from "@/libs/gridfs";
import {UploadedFile} from "@/libs/types";
import {getServerSession} from "next-auth";
import {Readable} from "stream";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return Response.json({error: 'Not authenticated'}, {status: 401});
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!file || typeof file === 'string' || !('arrayBuffer' in file)) {
    return Response.json({error: 'No file provided'}, {status: 400});
  }

  const bucket = await getImagesBucket();
  const buffer = Buffer.from(await file.arrayBuffer());

  const uploadStream = bucket.openUploadStream(file.name, {
    contentType: file.type,
  });

  await new Promise<void>((resolve, reject) => {
    Readable.from(buffer)
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve());
  });

  const fileId = uploadStream.id.toString();
  const uploadedFile: UploadedFile = {
    fileId,
    name: file.name,
    fileType: 'image',
    filePath: `/api/images/${fileId}`,
    url: `/api/images/${fileId}`,
  };

  return Response.json(uploadedFile);
}
