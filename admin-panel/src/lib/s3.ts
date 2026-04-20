import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadToS3(file: File, folder: string = "uploads"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const key = `${folder}/${fileName}`;
  
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicDomain = process.env.R2_PUBLIC_DOMAIN?.replace(/\/$/, "");

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicDomain) {
    throw new Error('Cloudflare R2 environment variables are not fully defined');
  }

  const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);

  // Return the public URL using the R2 public domain
  return `${publicDomain}/${key}`;
}
