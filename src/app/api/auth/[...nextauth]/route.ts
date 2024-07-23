// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import prisma from "@/lib/prisma"; // Adjust the path as necessary
import { User } from "@prisma/client";

const authOptions: AuthOptions = {
  pages: {
    signIn: "/login", // Ensure this path is correct
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
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
            email: username, // Assuming username is an email
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
        const { password: _, ...userWithoutPass } = user; // Exclude password
        return userWithoutPass;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as User; // Type assertion if necessary
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user; // Attach user to session
      return session;
    },
  },
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };
