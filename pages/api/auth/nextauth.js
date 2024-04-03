import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { registerUser, loginUser } from '../../../utils/auth';

const options = {
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials;

          // Check if the user is trying to register
          if (!email || !password) {
            throw new Error('Email and password are required');
          }

          // Check if the user is trying to login
          const { user, token } = await loginUser(email, password);
          return { user, token };
        } catch (err) {
          throw new Error(err.message);
        }
      },
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt(token, user) {
      if (user) {
        token.userId = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
    async session(session, token) {
      session.userId = token.userId;
      session.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

const Auth = (req, res) => NextAuth(req, res, options);
export default Auth;
