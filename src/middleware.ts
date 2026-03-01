import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Configuración base (sin Prisma) para el middleware Edge
const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // authorize se define en auth.ts completo, no acá
      authorize: () => null,
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: { auth: { user?: unknown } | null; request: { nextUrl: URL } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = nextUrl.pathname.startsWith("/admin");

      if (isAdmin) {
        if (isLoggedIn) return true;
        return false;
      }

      return true;
    },
  },
};

const { auth } = NextAuth(authConfig);

export default function middleware(request: any) {
  return auth(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
