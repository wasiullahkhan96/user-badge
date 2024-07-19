"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import Navbar from "./components/NavBar";
import Homepage from "./components/Homepage";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      {session && session.user ? (
        <div>
          <Navbar></Navbar>
          <div className="flex justify-center max-w-lg flex-col mx-auto">
            <Homepage session={session}></Homepage>
            <Link
              href="/api/auth/signout"
              className=" text-center font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign out
            </Link>
          </div>
        </div>
      ) : (
        <div>no session</div>
      )}
    </>
  );
}
