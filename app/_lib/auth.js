import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
        hotelId: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await fetch(`${BACKEND_URL}/public/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            hotelId: credentials.hotelId,
          }),
        });

        if (!res.ok) return null;

        const data = await res.json();

        return {
          id: data.guest.id,
          email: data.guest.email,
          fullName: `${data.guest.firstName} ${data.guest.lastName}`,
          accessToken: data.access_token,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullName = user.fullName;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.fullName;
        session.user.fullName = token.fullName;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};
