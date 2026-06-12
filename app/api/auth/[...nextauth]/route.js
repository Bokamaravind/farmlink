import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/Customer'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID     || 'placeholder',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder',
    }),

    // ── Customer email/password ──────────────────────────────────
    CredentialsProvider({
      id: 'customer',
      name: 'Customer',
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        await connectDB()
        const user = await Customer.findOne({ email: credentials.email.toLowerCase() })
        if (!user || !user.password) throw new Error('Invalid credentials')
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) throw new Error('Invalid credentials')
        return { id: user._id.toString(), name: user.name, email: user.email, avatar: user.avatar, role: 'customer' }
      },
    }),

    // ── Farmer ID + password ─────────────────────────────────────
    CredentialsProvider({
      id: 'farmer',
      name: 'Farmer',
      credentials: { farmerId: {}, password: {} },
      async authorize(credentials) {
        await connectDB()
        const Farmer = (await import('@/models/Farmer')).default
        const farmer = await Farmer.findOne({ farmerId: credentials.farmerId.toUpperCase() })
        if (!farmer) throw new Error('Farmer ID not found')
        const valid = await bcrypt.compare(credentials.password, farmer.password)
        if (!valid) throw new Error('Invalid password')
        return {
          id: farmer._id.toString(),
          name: farmer.name,
          farmerId: farmer.farmerId,
          phone: farmer.phone,
          region: farmer.region,
          role: 'farmer',
        }
      },
    }),

    // ── Delivery partner ─────────────────────────────────────────
    CredentialsProvider({
      id: 'delivery',
      name: 'Delivery',
      credentials: { partnerId: {}, password: {} },
      async authorize(credentials) {
        await connectDB()
        const DeliveryPartner = (await import('@/models/DeliveryPartner')).default
        const partner = await DeliveryPartner.findOne({ partnerId: credentials.partnerId.toUpperCase() })
        if (!partner) throw new Error('Partner ID not found')
        const valid = await bcrypt.compare(credentials.password, partner.password)
        if (!valid) throw new Error('Invalid password')
        return {
          id: partner._id.toString(),
          name: partner.name,
          partnerId: partner.partnerId,
          phone: partner.phone,
          role: 'delivery',
        }
      },
    }),

    // ── Admin ────────────────────────────────────────────────────
    CredentialsProvider({
      id: 'admin',
      name: 'Admin',
      credentials: { username: {}, password: {} },
      async authorize(credentials) {
        if (
          credentials.username === process.env.ADMIN_USERNAME &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: 'admin', name: 'FarmLink Admin', role: 'admin' }
        }
        throw new Error('Invalid admin credentials')
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB()
        let customer = await Customer.findOne({ email: user.email })
        if (!customer) {
          customer = await Customer.create({
            name: user.name, email: user.email,
            provider: 'google', googleId: user.id, avatar: user.image,
          })
        }
        user.id   = customer._id.toString()
        user.role = 'customer'
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.role      = user.role
        token.id        = user.id
        token.farmerId  = user.farmerId
        token.partnerId = user.partnerId
        token.phone     = user.phone
      }
      return token
    },
    async session({ session, token }) {
      session.user.role      = token.role
      session.user.id        = token.id
      session.user.farmerId  = token.farmerId
      session.user.partnerId = token.partnerId
      session.user.phone     = token.phone
      return session
    },
  },

  pages: { signIn: '/customer', error: '/customer' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
