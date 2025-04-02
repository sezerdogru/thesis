import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// İstek ve yanıt için tür tanımları
interface RequestBody {
  fileName: string;
  fileType: string;
}

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType }: RequestBody = await req.json();

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
    return NextResponse.json({ url }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Pre-signed URL hatası:", error?.message);
      return NextResponse.json(
        { error: `URL alınamadı: ${error.message}` },
        { status: 500 }
      );
    } else {
      console.error("Pre-signed URL hatası:", error);
      return NextResponse.json(
        { error: `URL alınamadı: ${error}` },
        { status: 500 }
      );
    }
  }
}
