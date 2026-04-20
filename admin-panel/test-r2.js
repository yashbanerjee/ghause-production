require('dotenv').config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');

async function testR2() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.R2_BUCKET_NAME;
  const publicDomain = process.env.R2_PUBLIC_DOMAIN?.replace(/\/$/, "");

  console.log('--- Cloudflare R2 Connectivity Test ---');
  console.log('Account ID:', accountId);
  console.log('Bucket:', bucketName);
  console.log('Public Domain:', publicDomain);

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicDomain) {
    console.error('Error: Missing R2 environment variables.');
    return;
  }

  const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const testKey = `test-r2-${Date.now()}.txt`;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: testKey,
    Body: 'Hello Cloudflare R2 Migration!',
    ContentType: 'text/plain',
  });

  try {
    const response = await s3Client.send(command);
    console.log('Success! File uploaded to R2.');
    const publicUrl = `${publicDomain}/${testKey}`;
    console.log('Public URL:', publicUrl);
    console.log('Response Metadata:', response.$metadata);
  } catch (err) {
    console.error('R2 Upload Failed:', err);
  }
}

testR2();
