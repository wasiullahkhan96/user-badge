// lib/aws.js
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const params = (fileName: string , buffer: Buffer) => {return {
  Bucket: process.env.AWS_S3_BUCKET_NAME ? process.env.AWS_S3_BUCKET_NAME : "budge-bucket",
  Key: `${Date.now()}_${fileName}`, // Unique filename
  Body:  buffer,
  ContentType: 'image/png',
  // ACL: 'public-read'
};}

export {s3, params};
