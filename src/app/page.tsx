"use client";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "./components/NavBar";
import Homepage from "./components/Homepage";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { ClipLoader } from "react-spinners";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session>();
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (!session || !session.user) {
          router.push("/login");
        } else {
          setSession(session);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <>
      {session && session.user ? (
        <div>
          <Navbar />
          <div className="flex justify-center max-w-lg flex-col mx-auto">
            <Homepage session={session} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default App;
