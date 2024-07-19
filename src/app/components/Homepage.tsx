"use client";

import { Session } from "next-auth";
import ImageUploader from "./ImageUploader";

interface HomepageProps {
  session: Session | null;
}

const Homepage: React.FC<HomepageProps> = ({ session }) => {
  function onUpload() {
    console.log("image has been uploaded");
  }

  return (
    <div>
      <div className="px-4 sm:px-0 text-center mt-5">
        <p>Welcome to Happy Badge</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <div className="flex justify-center">
          <div>
            <ImageUploader onUpload={onUpload}></ImageUploader>
          </div>
        </div>
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {session?.user ? session.user.firstName : "no name"}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Last Name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {session?.user ? session.user.lastName : "no last name"}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Email address
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {session?.user ? session.user.email : "no email"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Homepage;
