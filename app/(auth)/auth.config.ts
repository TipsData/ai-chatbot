// auth.config.ts
import CognitoProvider from "next-auth/providers/cognito";
import type { NextAuthConfig } from "next-auth";

if (!process.env.COGNITO_CLIENT_ID) {
  throw new Error("COGNITO_CLIENT_ID is not set");
}
if (!process.env.COGNITO_ISSUER) {
  throw new Error("COGNITO_ISSUER is not set");
}

console.log({
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
  COGNITO_ISSUER: process.env.COGNITO_ISSUER,
  REDIRECT_URI: "http://localhost:3000/api/auth/callback/cognito",
});

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      issuer: process.env.COGNITO_ISSUER,
      checks: ["pkce"],
      client: {
        token_endpoint_auth_method: "none",
      },
      authorization: {
        url: `https://us-east-1s4vcubdqd.auth.us-east-1.amazoncognito.com/oauth2/authorize`,
        params: {
          response_type: "code",
          client_id: process.env.COGNITO_CLIENT_ID,
          scope: "openid email profile",
          redirect_uri: `http://localhost:3000/api/auth/callback/cognito`,
        },
      },
      token: {
        url: "https://us-east-1s4vcubdqd.auth.us-east-1.amazoncognito.com/oauth2/token",
      },
      userinfo: {
        url: "https://us-east-1s4vcubdqd.auth.us-east-1.amazoncognito.com/oauth2/userInfo",
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      console.log("JWT Callback:", { trigger, user, account, token });
      if (trigger === "signIn" || trigger === "signUp") {
        if (user && account) {
          token.id = user.sub || user.id || "";
          token.type = "cognito";
          token.email = user.email ?? "";
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback:", { session, token });
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
        session.user.email = token.email || "";
      }
      return session;
    },
  },
  logger: {
    error(code, ...message) {
      console.error("NextAuth Error:", code, ...message);
    },
    warn(code, ...message) {
      console.warn("NextAuth Warning:", code, ...message);
    },
    debug(code, ...message) {
      console.debug("NextAuth Debug:", code, ...message);
    },
  },
} satisfies NextAuthConfig;