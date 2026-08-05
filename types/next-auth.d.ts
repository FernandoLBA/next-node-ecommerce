import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extends the default Session interface to include the user id and role
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  /**
   * Extends the default User interface to include the role
   */
  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}