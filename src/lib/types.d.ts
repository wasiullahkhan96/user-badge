import { User } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: User;
  }
}

export interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  password: string;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}
