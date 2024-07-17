import prisma from "@/lib/prisma";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import NextAuth from "next-auth/next";

export const authOptions: AuthOptions = {
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
        // Implement your logic to find and verify the user
        if (!credentials) {
          throw new Error("No credentials provided");
        }


        if(!credentials.username){
            throw new Error('Please provide username')
        }
        if(!credentials.password){
            throw new Error('Please provide password')
        }

        // Replace with your own logic to find user in your database
        const user = await prisma.user.findUnique({
            where:{
                email: credentials.username
            }
          });

        if (!user) {
          throw new Error("No user found with the given username");
        }

        // Replace with your own logic to validate the password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // If the user is authenticated, return the user object
        const {password, ...userWithoutPass} = user;
        return userWithoutPass;
      },
    }),
  ],
};


const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};


