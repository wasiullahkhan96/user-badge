"use client";

import { Session } from "next-auth";
import ImageUploader from "./ImageUploader";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import axios from "axios";
import { useUser } from "./ProviderWrapper";

interface HomepageProps {
  session: Session | null;
}

const Homepage: React.FC<HomepageProps> = ({ session }) => {
  const { user, setUser } = useUser();

  useEffect(() => {
    axios.get(`/api/getUserById?userId=${session?.user.id}`).then((res) => {
      setUser(res.data);
      console.log(res.data);
    }); // Adjust the endpoint as necessary
  }, [session?.user.id, setUser]);

  return (
    <div>
      <div className="px-4 sm:px-0 text-center mt-5">
        <p>Welcome to Happy Badge {session?.user.image}</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <div className="flex justify-center">
          <div>
            <ImageUploader></ImageUploader>
          </div>
        </div>
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Email address
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {user ? user.email : "-"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Homepage;
