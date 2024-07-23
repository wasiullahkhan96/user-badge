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
    <div className="mt-6">
      <div className="flex flex-col justify-center items-center">
        {user ? (
          <>
            <div className="mt-4">
              <ImageUploader />
            </div>
            <div className="overflow-x-auto bg-white mt-4 ">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <tbody>
                  <tr className="border-b ">
                    <th scope="row" className="px-6 py-4">
                      Email
                    </th>
                    <td className="px-6 py-4">{user.email}</td>
                  </tr>
                  <tr className="border-b ">
                    <th scope="row" className="px-6 py-4">
                      ID
                    </th>
                    <td className="px-6 py-4">{user.id}</td>
                  </tr>
                  <tr className="border-b ">
                    <th scope="row" className="px-6 py-4">
                      S3 Bucket Link
                    </th>
                    <td className="px-6 py-4">{user.image}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Homepage;
