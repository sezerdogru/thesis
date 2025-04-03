import type { NextApiRequest, NextApiResponse } from "next";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

// S3 Client'ı yapılandır
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Response tipi
export type ImageProp = {
  key: string;
  url: string;
};

type ApiResponse = {
  images: ImageProp[];
  message?: string;
};

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | { error: string }>
) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME, // Bucket adını buraya yaz
    });

    const data = await s3Client.send(command);

    if (!data.Contents || data.Contents.length === 0) {
      return NextResponse.json(
        { images: [], message: "Bucket'ta resim yok" },
        { status: 200 }
      );
    }

    const images: ImageProp[] = data.Contents.map((item) => ({
      key: item.Key as string,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
    }));

    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Resimler çekilemedi" }, { status: 500 });
  }
}
