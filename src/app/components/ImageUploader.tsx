import { useState } from "react";

interface BadgeUploadProps {
  onUpload: (badge: HTMLImageElement) => void;
  // Optional: Define color validation logic here for better separation
  isHappyColor?: (color: string) => boolean;
}

const BadgeUpload: React.FC<BadgeUploadProps> = ({
  onUpload,
  isHappyColor = defaultIsHappyColor,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      // Basic image type check
      setImageFile(file);
      setErrorMessage(null);
    } else {
      setImageFile(null);
      setErrorMessage("Please select a valid image file.");
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setErrorMessage("Please select an image");
      return;
    }

    const image = await convertImage(imageFile); // Use convertImage if needed
    const isValid = validateBadge(image);

    if (isValid) {
      onUpload(image);
      setImageFile(null);
    } else {
      setErrorMessage(
        "Invalid badge image. Please check size, transparency, and colors."
      );
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleInputChange} />
      <button onClick={handleUpload}>Upload Badge</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

// Default implementation for color validation (replace with your logic)
function defaultIsHappyColor(color: string): boolean {
  // Implement your happy color logic here
  return true; // Placeholder for now
}

export default BadgeUpload;

// convertImage.ts (Optional)
export async function convertImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => URL.revokeObjectURL(url);
  image.src = url;
  await image.decode();
  return image;
}

// isHappyColor.ts
export function isHappyColor(color: string): boolean {
  // Implement your logic to determine happy colors
  // You can use libraries like chroma.js or define ranges for bright, warm colors
  // This is a simplified example
  // const hsl = color.replace(/^#?/, '').match(/(.{2})/g).map(val => parseInt(val, 16));
  // const hue = hsl[0] / 255;
  // const saturation = hsl[1] / 255;
  // // Happy colors tend to be bright and warm
  // return (hue >= 0.1 && hue <= 0.5) && saturation >= 0.5;
  return true;
}

// validateBadge.ts
export function validateBadge(image: HTMLImageElement): boolean {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = image.width;
  canvas.height = image.height;

  if (ctx) {
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;

    // Check size
    if (image.width !== 512 || image.height !== 512) {
      return false;
    }

    // Check transparency and circle
    const radius = image.width / 2;
    for (let y = 0; y < image.height; y++) {
      for (let x = 0; x < image.width; x++) {
        const distance = Math.sqrt(
          Math.pow(x - radius, 2) + Math.pow(y - radius, 2)
        );
        const isTransparent = data[y * image.width * 4 + x * 4 + 3] === 0;
        if (!isTransparent && distance > radius) {
          return false;
        }
      }
    }
  }

  // Check happy colors (optional, uncomment)
  // for (let i = 0; i < data.length; i += 4) {
  //   const color = `rgba(${data[i]}, ${data[i + 1]}, ${data[i + 2]}, ${data[i + 3] / 255})`;
  //   if (!isHappyColor(color)) {
  //     return false;
  //   }
  // }

  return true;
}
