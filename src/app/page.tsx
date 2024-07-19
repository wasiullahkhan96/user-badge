"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import Navbar from "./components/NavBar";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div>
      <Navbar></Navbar>

      {session && session.user ? (
        <>
          <>{session.user.email}</>
          <>{session.user.createdAt}</>
          <>{session.user.updatedAt}</>
          <button>
            <Link href={"/api/auth/signout"}></Link>
          </button>
        </>
      ) : (
        <div>no session</div>
      )}
    </div>
  );
}
