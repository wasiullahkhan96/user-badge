import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/login" });
      toast.success("You have been successfully logged out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ">
          <p className="text-white font-bold text-xl">Happy Badge</p>
          <button
            onClick={handleSignOut}
            className="text-white bg-indigo-300 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-indigo-600 dark:hover:bg-indigo-600 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
