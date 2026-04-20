require('dotenv').config();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  forcePathStyle: true,
});

async function testS3() {
  console.log('--- S3 Connectivity Test ---');
  console.log('Endpoint:', process.env.S3_ENDPOINT);
  console.log('Bucket:', process.env.S3_BUCKET);

  const testKey = `test-${Date.now()}.txt`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: testKey,
    Body: 'Hello Railway S3!',
    ContentType: 'text/plain',
  });

  try {
    const response = await s3.send(command);
    console.log('Success! File uploaded.');
    console.log('Public URL (Predicted):', `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${testKey}`);
    console.log('Response:', response);
  } catch (err) {
    console.error('S3 Upload Failed:', err);
  }
}

testS3();
