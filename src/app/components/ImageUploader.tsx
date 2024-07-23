import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UserCircleIcon, EditIcon } from "./Icons";
import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useUser } from "./ProviderWrapper";

const BadgeUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, setUser } = useUser();

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Basic client-side checks
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File size should be less than 5MB.");
      return;
    }

    // Create a preview
    const reader = new FileReader();
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("badge", file);

    try {
      const response = await axios.post("/api/verify-badge", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setUser({ ...user, image: response.data.imageUrl });
      }
    } catch (error) {
      toast.error("Error uploading image.");
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-row justify-center items-start mt-4">
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
        <input
          type="file"
          onChange={handleInputChange}
          ref={fileInputRef}
          style={{ display: "none" }} // Make the file input element invisible
          accept="image/png"
        />
        {user ? (
          <Image
            src={user.image ?? ""}
            alt="Badge Preview"
            height={128}
            width={128}
          />
        ) : (
          <UserCircleIcon />
        )}
      </div>
      <button type="button" onClick={onButtonClick}>
        <EditIcon />
      </button>
    </div>
  );
};

export default BadgeUpload;
