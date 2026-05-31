import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Extiende el objeto 'user' devuelto en la sesión
   */
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  /**
   * Extiende la interfaz de User para incluir el rol
   */
  interface User {
    role?: string;
  }
}