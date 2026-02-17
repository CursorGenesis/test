import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        // Optional: Keep CredentialsProvider for admin login if needed, or remove it
    ],
    pages: {
        signIn: "/profile",
    },
    callbacks: {
        async session({ session, token }) {
            // Add extra data to session if needed
            session.user.id = token.sub;
            return session;
        },
    },
});

export { handler as GET, handler as POST };
