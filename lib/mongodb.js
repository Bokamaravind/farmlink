import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is missing in .env.local')
}

if (MONGODB_URI.includes('<username>') || MONGODB_URI.includes('xxxxx')) {
  throw new Error('❌ You have not replaced the placeholder in MONGODB_URI inside .env.local\n\nGo to mongodb.com/atlas → Connect → Drivers → copy the real URI')
}

let cached = global.mongoose
if (!cached) cached = global.mongoose = { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }).catch(err => {
      cached.promise = null
      throw err
    })
  }
  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (err) {
    cached.promise = null
    throw err
  }
}
