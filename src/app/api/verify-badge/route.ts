import s3 from "@/lib/aws";
import prisma from "@/lib/prisma";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { isValid } from "zod";

export async function POST(req: NextRequest) {
  // This part checks if there is a session, the server redirects to the login page
  // We can easily set this function as a middleware that intecepts all protected routes
  const token = await getToken({ req: req }); // Use getToken to get the session token
  if (!token) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url)); // Redirect to sign-in if no token
  }
  const user = token.user;

  const formData = await req.formData();
  const file = formData.get("badge") as File;

  // If there is no file in the form the server returns an error
  if (!file) {
    return NextResponse.json(
      { isValid: false, message: "No file uploaded" },
      { status: 400 }
    );
  }

  try {
    // Here we start the image analysis, first we convert the image into a buffer
    // so it's easier to handle processing with sharp
    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // If the size is not up to requirement, the server returns an error message
    if (metadata.width !== 512 || metadata.height !== 512) {
      return NextResponse.json(
        { isValid: false, message: "Image must be 512x512 pixels" },
        { status: 400 }
      );
    }

    // A circular mask is cast on the image so it takes a circular layout
    const processedImage = await image
      .resize(512, 512)
      .ensureAlpha()
      // .composite([
      //   {
      //     input: Buffer.from(`<svg><circle cx="256" cy="256" r="256" /></svg>`),
      //     blend: 'dest-in'
      //   }
      // ])
      .png()
      .toBuffer();

    // At this point we create a raw instance of the image to count RBG colors
    // in the image and establish a heuristic for a happy ratio in our picture
    // evaluating that the circle contains only non transparent pixels
    const { data, info } = await sharp(processedImage)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const centerX = info.width / 2;
    const centerY = info.height / 2;
    const radius = centerX; // Assuming the image is square and the circle is centered

    let happyColorCount = 0;
    let totalColoredPixels = 0;

    // Here we loop over all the elements in data array knowing that each pixel takes up
    // 4 cells in the data array. This means that to iterate over all the pixels we
    // need to make a +4 jump in the array
    for (let index = 0; index < data.length; index += 4) {
      // To calculate x we need to convert to index to the actual pixel in consideration.
      // Next we calculate the remainder based on the width which results in the coordinate
      // for x independent of the current row
      const x = (index / 4) % info.width;
      // Similar consideration goes for y: we convert to actual pixels and then divide
      // by the width once more. The result is then floored giving us the actual y coordinate
      const y = Math.floor(index / 4 / info.width);

      // At this point we need to find the distance of the {x,y} coordinate from the center.
      // Based on Pythagorean theorem, we know that the distance the hypotenuse (representing)
      // the distance is x^2+y^2=i^2. Having the radius^2 and i^2 we can then proceed to
      // establish the position and see if it's within the circle or outside.
      // In the latter case, we need to check the opacity

      const dx = x - centerX;
      const dy = y - centerY;
      const distanceSquared = dx * dx + dy * dy;

      // Here we check all the pixels within the circle
      if (distanceSquared < radius * radius) {
        const r = data[index];
        const g = data[index + 1];
        const a = data[index + 3];

        if (a == 0) {
          return NextResponse.json(
            {
              isValid: false,
              message: "Non-transparent pixels are within the circle",
            },
            { status: 400 }
          );
        } else {
          // As we are checking the trasparancy within the circle, we count the "happy" pixels
          // on our custom rule based on red and green weights
          if ((r > 200 && g > 150) || (r > 150 && g > 200)) {
            happyColorCount++;
          }
          totalColoredPixels++;
        }
      }
    }

    // Calculate the happy color percentage
    const happyColorPercentage = (happyColorCount / totalColoredPixels) * 100;

    // If we've made it this far, the image is valid

    // First we need to upload the object in the S3 bucket

    try {
      // Retrieve the existing user's image key from the database
      const mongoUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { image: true }, // Get the current image URL
      });

      if (mongoUser && mongoUser.image) {
        // Extract the existing image key from the URL
        const existingImageKey = mongoUser.image?.split("/").pop() ?? "";
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME ?? "budge-bucket",
          Key: existingImageKey,
        };
        // Delete the existing image from S3
        console.log("delete:", params);
        try {
          const data = await s3.deleteObject(params).promise();
        } catch (error) {
          console.error(
            `Error deleting ${existingImageKey} from ${params.Bucket}:`,
            error
          );
          return NextResponse.json(
            {
              isValid: false,
              message: "An error occurred while updating the image",
            },
            { status: 500 }
          );
        }
      }
    } catch (error) {}

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME
        ? process.env.AWS_S3_BUCKET_NAME
        : "budge-bucket",
      Key: `${Date.now()}_${file.name}`,
      Body: buffer,
      ContentType: "image/png",
    };

    try {
      const result = await s3.upload(params).promise();

      if (result) {
        try {
          // Update the user's image attribute using Prisma
          const updatedUser = await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              image: result.Location,
            },
          });
        } catch (error) {
          return NextResponse.json(
            {
              isValid: false,
              message: "There has been an error updating the user",
            },
            { status: 500 }
          );
        }
      }

      const message =
        happyColorPercentage < 50 ? "Look for brighter colors!" : "Nice!";
      return NextResponse.json({
        isValid: true,
        message: `Badge uploaded with a ${Math.floor(
          happyColorPercentage
        )}% happy percentage. ${message}`,
        imageUrl: result.Location,
      });
    } catch (error) {
      return NextResponse.json(
        {
          isValid: false,
          message: "An error occurred while uploading the image",
        },
        { status: 500 }
      );
      // Handle the error as needed
    }
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { isValid: false, message: "Error processing image" },
      { status: 500 }
    );
  }
}
