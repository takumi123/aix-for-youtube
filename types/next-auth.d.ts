import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken?: string;
      refreshToken?: string;
    } & DefaultSession["user"]
  }
  
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
  }
}
