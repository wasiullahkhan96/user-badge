## Getting Started

After cloning the repository, you need to create a .env file with the following environment variables:

```bash
NEXTAUTH_SECRET=3F48yInV0dEDGLgMqGdm/RwZ5AuJTlPqpp2IksFnMSI=
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://wasiullahkhan96:wasiullahkhan96@badgeusercluster.5hgwgcz.mongodb.net/badge_db?retryWrites=true&w=majority&appName=BadgeUserCluster
AWS_ACCESS_KEY_ID=AKIA2YICAURKL2S6WA5Q
AWS_SECRET_ACCESS_KEY=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
AWS_REGION=eu-north-1
AWS_S3_BUCKET_NAME=budge-bucket
```

After creating the file, you have to run the following commands to start the project locally:

```bash
npm install
npx prisma generate
npm run
```

The core of the solution to the case study is in the src\app\components\ImageUploader.tsx file. You can find the logic and the steps to create the badge according to the requirements
