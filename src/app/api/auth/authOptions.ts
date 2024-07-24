import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "User Name",
          type: "text",
          placeholder: "Your User Name",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { username, password } = credentials;

        if (!username) {
          throw new Error("Please provide username");
        }
        if (!password) {
          throw new Error("Please provide password");
        }

        // Find user in your database
        const user = await prisma.user.findUnique({
          where: {
            email: username,
          },
        });

        if (!user) {
          throw new Error("No user found with the given username");
        }

        // Validate the password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // If the user is authenticated, return the user object
        const { password: _, ...userWithoutPass } = user;
        return userWithoutPass;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as User;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
};
