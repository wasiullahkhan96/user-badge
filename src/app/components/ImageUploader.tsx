import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UserCircleIcon, EditIcon } from "./Icons";
import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/react";
import { useUser } from "./ProviderWrapper";
import { ClipLoader } from "react-spinners";

const BadgeUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarLoading, setAvatarLoading] = useState(false); // Separate loading state for avatar update
  const { user, setUser } = useUser();

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAvatarLoading(true); // Start loading state for avatar upload
    const file = event.target.files?.[0];
    if (!file) {
      setAvatarLoading(false);
      return;
    }

    // Basic client-side checks
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      setAvatarLoading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File size should be less than 5MB.");
      setAvatarLoading(false);
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
    } finally {
      setAvatarLoading(false); // End loading state for avatar upload
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-row justify-center items-start mt-4">
      <div className="w-60 h-60 rounded-full overflow-hidden border-2 border-gray-300 relative">
        <input
          type="file"
          onChange={handleInputChange}
          ref={fileInputRef}
          style={{ display: "none" }} // Make the file input element invisible
          accept="image/png"
        />

        {avatarLoading ? (
          <div className="flex items-center justify-center w-full h-full absolute top-0 left-0 bg-gray-500 bg-opacity-50">
            <ClipLoader size={50} color={"#123abc"} loading={avatarLoading} />
          </div>
        ) : user && user.image ? (
          <Image
            src={user.image}
            alt="Badge Preview"
            height={240}
            width={240}
          />
        ) : (
          <UserCircleIcon />
        )}
      </div>
      <button type="button" onClick={onButtonClick} className="ml-4">
        <EditIcon />
      </button>
    </div>
  );
};

export default BadgeUpload;
