// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth/next";
import { authOptions } from "../authOptions";

const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests
export { handler as GET, handler as POST };
