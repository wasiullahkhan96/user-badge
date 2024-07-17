"use client";

import Navbar from "../components/NavBar";

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar></Navbar>
      <h1 className="text-center mt-4 font-extrabold">
        Welcome to Happy Badge
      </h1>
      {children}
    </div>
  );
}
