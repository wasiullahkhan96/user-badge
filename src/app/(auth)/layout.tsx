"use client";

import Navbar from "../components/NavBar";

export default function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
